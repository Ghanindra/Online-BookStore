using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BookStore.Data;
using BookStore.DTOs;
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
        private decimal discountAmount;

        public object MemberId { get; private set; }

        public OrdersController(ApplicationDbContext context, DiscountService discountService, IEmailService emailService, ILogger<OrdersController> logger)
        {
            _context = context;
            _discountService = discountService;
            _emailService = emailService;
            _logger = logger;
        }


[HttpPost]
public async Task<IActionResult> PlaceOrder([FromBody] List<int> bookIds)
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

    // Fetch CartItems that match the provided bookIds
    var cartItems = await _context.CartItems
        .Where(ci => bookIds.Contains(ci.BookId) && ci.UserId == userId)
        .Include(ci => ci.Book)
        .ToListAsync();

    if (cartItems.Count != bookIds.Count)
    {
        _logger.LogWarning("Some books not found in the cart. Expected: {ExpectedCount}, Found: {FoundCount}", bookIds.Count, cartItems.Count);
        return BadRequest("One or more books not found in the cart.");
    }

    // Log prices of books before summing
    foreach (var cartItem in cartItems)
    {
        _logger.LogInformation("Book: {BookTitle}, Price: {Price}, Quantity: {Quantity}",
            cartItem.Book.Title, cartItem.Book.Price, cartItem.Quantity);
    }

    // Calculate the total price considering the quantity in the CartItems
    decimal totalPrice = cartItems.Sum(ci => ci.Book.Price * ci.Quantity);

    _logger.LogInformation("Number of books in the cart: {CartItemCount}", cartItems.Count);
    _logger.LogInformation("Total price of the order: {TotalPrice}", totalPrice);

    var finalPrice = _discountService.CalculateDiscount(user, cartItems.Count, totalPrice);
    _logger.LogInformation("Total Price: {TotalPrice}, Final Price: {FinalPrice}", totalPrice, finalPrice);

    var discountamount = totalPrice - finalPrice;
    var claimCode = Guid.NewGuid().ToString().Substring(0, 6).ToUpper();

    var order = new Order
    {
        UserId = userId,
        Member = user,
        FinalPrice = finalPrice,
         DiscountAmount = discountamount, // ✅ Save discount here
        ClaimCode = claimCode,
        Books = cartItems.Select(ci => ci.Book).ToList() // Add books to the order
    };
 // Add order to the database
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
         // Optionally, return the order details in the response
       
    using (var transaction = await _context.Database.BeginTransactionAsync())
    {
        try
        {
            _logger.LogInformation("Placing order for User ID: {UserId}", userId);

//    await transaction.CommitAsync();
            // Update the user's SuccessfulOrderCount after the successful order
            user.SuccessfulOrders += 1;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Send confirmation email asynchronously
            var emailTask = _emailService.SendEmailAsync(user.Email, "Your Order Confirmation", $"Claim Code: {claimCode}\nTotal: {finalPrice:C}\nOrderId:{order.Id}\nMemberId:{order.MemberId}");

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
 await transaction.RollbackAsync(); // Rollback the transaction on error
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
            // / Decrease the SuccessfulOrderCount of the user
    var user = await _context.Users.FindAsync(userId);
    if (user != null && user.SuccessfulOrders > 0)
    {
        user.SuccessfulOrders -= 1;
        _context.Users.Update(user);
    }
            await _context.SaveChangesAsync();

            _logger.LogInformation("Order canceled successfully. Order ID: {OrderId}", id);
            return Ok("Order canceled.");
        }

       
//  [HttpGet("user")]
// public async Task<IActionResult> GetUserOrders()
// {
//     var userIdClaim = User?.FindFirstValue(ClaimTypes.NameIdentifier);
//     if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
//     {
//         _logger.LogWarning("Invalid or missing user ID.");
//         return Unauthorized("User not authenticated.");
//     }

//     var orders = await _context.Orders
//         .Include(o => o.Books)
//         .Where(o => o.UserId == userId)
//         .Select(o => new
//         {
//             o.Id,
//             o.ClaimCode,
//             o.FinalPrice,
//             o.IsCanceled,
//             BookTitles = o.Books.Select(b => b.Title).ToList()
//         })
//         .ToListAsync();

//     return Ok(orders);
// }
[HttpGet("user")]
public async Task<IActionResult> GetUserOrders()
{
    var userIdClaim = User?.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
    {
        _logger.LogWarning("Invalid or missing user ID.");
        return Unauthorized("User not authenticated.");
    }

    var orders = await _context.Orders
        .Include(o => o.Books)
        .Where(o => o.UserId == userId)
        .Select(o => new
        {
            o.Id,
            o.ClaimCode,
            o.FinalPrice,
            o.IsCanceled,
            Books = o.Books.Select(b => new
            {
                b.Id,
                b.Title,
                b.Author,
                b.Price,
                b.ImageUrl,  // if your Book model has an image
                b.Description // optional
            }).ToList()
        })
        .ToListAsync();

    return Ok(orders);
}

// [HttpGet("all")]
// public async Task<IActionResult> GetAllUsersOrders()
// {
//     var orders = await _context.Orders
//         .Include(o => o.Books) // Include related Books data
//         // .Include(o => o.users)  // Assuming 'User' is the correct navigation property
//         .Select(o => new
//         {
//             o.Id,
//             o.ClaimCode,
//             o.FinalPrice,
//             o.IsCanceled,
//             Books = o.Books.Select(b => new
//             {
//                 b.Id,
//                 b.Title,
//                 b.Author,
//                 b.Price,
//                 b.ImageUrl,
//                 b.Description
//             }).ToList(),
//             // User = new
//             // {
//             //     o.UserId
                
                
//             // }
//         })
//         .ToListAsync();

//     return Ok(orders);
// }
// [HttpGet("all")]
// public async Task<IActionResult> GetAllUsersOrders()
// {
//     // Fetch all orders with the UserId
//     var orders = await _context.Orders
//         .Include(o => o.Books) // Include related Books data
//         .Select(o => new
//         {
//             o.Id,
//             o.ClaimCode,
//             o.FinalPrice,
//             o.IsCanceled,
//             o.UserId,  // Fetch UserId to later join
//             Books = o.Books.Select(b => new
//             {
//                 b.Id,
//                 b.Title,
//                 b.Author,
//                 b.Price,
//                 b.ImageUrl
//             }).ToList()
//         })
//         .ToListAsync();

//     // Fetch all users (you could also add conditions for filtering)
//     var users = await _context.Users
//         .Select(u => new
//         {
//             u.Id,
//             u.FullName,
//             u.Email,
//             // u.Role // Add other user properties as needed
//         })
//         .ToListAsync();

//     // Join the orders with the corresponding user data based on UserId
//     var ordersWithUsers = orders.Select(order => new
//     {
//         order.Id,
//         order.ClaimCode,
//         order.FinalPrice,
//         order.IsCanceled,
//         User = users.FirstOrDefault(user => user.Id == order.UserId),
//         Books = order.Books
//     }).ToList();

//     return Ok(ordersWithUsers); // Return the combined result
// }

[HttpGet("all")]
public async Task<IActionResult> GetAllUsersOrders(string? claimCode = null)
{
    // 1) build up the Orders query
    var query = _context.Orders
        .Include(o => o.Books)
        .AsQueryable();

    // 2) if the client passed ?claimCode=XYZ, filter by it (case-insensitive)
    if (!string.IsNullOrWhiteSpace(claimCode))
    {
        var code = claimCode.Trim().ToLower();
        query = query.Where(o => o.ClaimCode.ToLower().Contains(code));
    }

    // 3) project to your DTO
    var orders = await query
        .Select(o => new
        {
            o.Id,
            o.ClaimCode,
            o.FinalPrice,
            o.IsCanceled,
            o.IsSupplied,
            o.SuppliedAt,
            o.UserId,
            Books = o.Books.Select(b => new {
                b.Id, b.Title, b.Author, b.Price, b.ImageUrl
            }).ToList()
        })
        .ToListAsync();

    // 4) pull in users
    var users = await _context.Users
        .Select(u => new { u.Id, u.FullName, u.Email })
        .ToListAsync();

    // 5) join in-memory
    var result = orders
        .Select(o => new {
            o.Id,
            o.ClaimCode,
            o.FinalPrice,
            o.IsCanceled,
            o.IsSupplied,
             o.SuppliedAt,
            User = users.FirstOrDefault(u => u.Id == o.UserId),
            o.Books
        })
        .ToList();

    return Ok(result);
}
// [Authorize]
// [HttpPatch("{id}/supply")]
// public async Task<IActionResult> MarkAsSupplied(int id)
// {
//     var order = await _context.Orders.FindAsync(id);
//     if (order == null)
//     {
//         return NotFound();
//     }

//     order.IsSupplied = true;

//     try
//     {
//         await _context.SaveChangesAsync();
//         return Ok(new { message = "Order marked as supplied." });
//     }
//     catch (Exception ex)
//     {
//         return StatusCode(500, new { error = "Failed to update order.", details = ex.Message });
//     }
// }


[HttpPatch("{id}/supply")]
public async Task<IActionResult> MarkAsSupplied(int id)
{
    var order = await _context.Orders.FindAsync(id);
    if (order == null) return NotFound();

    order.IsSupplied = true;
    order.SuppliedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return Ok(new { message = "Order marked as supplied." });
}


    }
}
