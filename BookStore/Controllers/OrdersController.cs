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
            if (bookIds == null || bookIds.Count == 0)
            {
                return BadRequest("No books selected.");
            }

            var userIdClaim = User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User not authenticated.");
            }

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user ID.");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            var books = await _context.Books.Where(b => bookIds.Contains(b.Id)).ToListAsync();
            if (books.Count != bookIds.Count)
            {
                return BadRequest("One or more books not found.");
            }

            decimal totalPrice = books.Sum(b => b.Price);
            var finalPrice = _discountService.CalculateDiscount(user, books.Count, totalPrice);
            var claimCode = Guid.NewGuid().ToString().Substring(0, 6).ToUpper();

            var order = new Order
            {
                UserId = userId,
                User = user,
                FinalPrice = finalPrice,
                ClaimCode = claimCode,
                Books = books
            };

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    _context.Orders.Add(order);
                    await _context.SaveChangesAsync();

                    // Email sending in the background to not block the main flow
                    var emailTask = _emailService.SendEmailAsync(user.Email, "Your Order Confirmation", $"Claim Code: {claimCode}\nTotal: {finalPrice:C}");

                    await transaction.CommitAsync();

                    // Ensure the email is sent asynchronously
                    await emailTask;

                    return Ok(new { orderId = order.Id, claimCode });
                }
                catch (Exception ex)
                {
                    // Log the exception for debugging purposes
                    _logger.LogError(ex, "Error placing order");

                    // Return a generic error message to the user
                    return StatusCode(500, "An error occurred while processing your order.");
                }
            }
        }

        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound("Order not found.");

            // Check if the order belongs to the authenticated user
            if (order.UserId != int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))
            {
                return Unauthorized("You can only cancel your own orders.");
            }

            // Prevent cancellation if the order is already canceled or completed
            if (order.IsCanceled)
            {
                return BadRequest("This order is already canceled.");
            }

            // Mark the order as canceled
            order.IsCanceled = true;
            await _context.SaveChangesAsync();

            return Ok("Order canceled.");
        }
    }
}
