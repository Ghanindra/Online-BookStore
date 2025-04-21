using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BookStore.Data;
using BookStore.Models;
using BookStore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BookStore.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly DiscountService _discountService;
        private readonly IEmailService _emailService;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(ApplicationDbContext context, DiscountService discountService, IEmailService emailService, ILogger<OrdersController> logger)
        {
            _context = context;
            _discountService = discountService;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder(List<int> bookIds)
        {
            if (bookIds == null || !bookIds.Any())
            {
                _logger.LogWarning("No books selected for the order.");
                return BadRequest("No books selected.");
            }

            var userIdClaim = User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
            {
                _logger.LogWarning("User not authenticated.");
                return Unauthorized("User not authenticated.");
            }

            if (!int.TryParse(userIdClaim, out int userId))
            {
                _logger.LogWarning("Invalid user ID: {UserIdClaim}", userIdClaim);
                return Unauthorized("Invalid user ID.");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User not found for ID: {UserId}", userId);
                return Unauthorized("User not found.");
            }

            var books = await _context.Books.Where(b => bookIds.Contains(b.Id)).ToListAsync();
            if (books.Count != bookIds.Count)
            {
                _logger.LogWarning("Some books not found. Expected: {ExpectedCount}, Found: {FoundCount}", bookIds.Count, books.Count);
                return BadRequest("One or more books not found.");
            }

            decimal totalPrice = books.Sum(b => b.Price);
            var finalPrice = _discountService.CalculateDiscount(user, books.Count, totalPrice);
            var claimCode = Guid.NewGuid().ToString().Substring(0, 6).ToUpper();

            var order = new Order
            {
                UserId = userId,
                Member = user,
                FinalPrice = finalPrice,
                ClaimCode = claimCode,
                Books = books
            };

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    _logger.LogInformation("Placing order for User ID: {UserId}", userId);
                    
                    _context.Orders.Add(order);
                    await _context.SaveChangesAsync();

                    // Send confirmation email asynchronously
                    var emailTask = _emailService.SendEmailAsync(user.Email, "Your Order Confirmation", $"Claim Code: {claimCode}\nTotal: {finalPrice:C}");

                    await transaction.CommitAsync();

                    // Wait for email to be sent asynchronously
                    await emailTask;

                    _logger.LogInformation("Order placed successfully. Order ID: {OrderId}, Claim Code: {ClaimCode}", order.Id, claimCode);

                    return Ok(new { orderId = order.Id, claimCode });
                }
                catch (Exception ex)
                {
                    // Log the exception for debugging purposes
                    _logger.LogError(ex, "Error placing order for User ID: {UserId}", userId);

                    // Return a generic error message to the user
                    return StatusCode(500, "An error occurred while processing your order.");
                }
            }
        }

        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                _logger.LogWarning("Order not found. Order ID: {OrderId}", id);
                return NotFound("Order not found.");
            }

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Check if the order belongs to the authenticated user
            if (order.UserId != userId)
            {
                _logger.LogWarning("User {UserId} attempted to cancel an order they don't own. Order ID: {OrderId}", userId, id);
                return Unauthorized("You can only cancel your own orders.");
            }

            // Prevent cancellation if the order is already canceled or completed
            if (order.IsCanceled)
            {
                _logger.LogWarning("Attempted to cancel an already canceled order. Order ID: {OrderId}", id);
                return BadRequest("This order is already canceled.");
            }

            // Mark the order as canceled
            order.IsCanceled = true;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Order canceled successfully. Order ID: {OrderId}", id);
            return Ok("Order canceled.");
        }
    }
}
