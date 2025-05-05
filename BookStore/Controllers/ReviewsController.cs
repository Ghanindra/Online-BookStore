// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Security.Claims;
// using System.Threading.Tasks;
// using BookStore.Data;
// using BookStore.Models;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;

// namespace BookStore.Controllers
// {
//     [Authorize]
// [ApiController]
// [Route("api/[controller]")]
// public class ReviewsController : ControllerBase
// {
//     private readonly ApplicationDbContext _context;

//     public ReviewsController(ApplicationDbContext context)
//     {
//         _context = context;
//     }

//     [HttpPost("{bookId}")]
// public async Task<IActionResult> AddReview(int bookId, [FromBody] ReviewDTO reviewDto)
// {
//     var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
//  // Check if the user has purchased the book
//             // var hasPurchased = await _context.Orders
//             //     .AnyAsync(order => order.UserId == userId && order.OrderItems.Any(item => item.BookId == bookId));

//             // if (!hasPurchased)
//             // {
//             //     return BadRequest("You must purchase the book before reviewing it.");
//             // }
//     //         // Check if the user has purchased the book (check BookOrders table)
//     // var hasPurchased = await _context.BookOrder
//     //     .AnyAsync(bookOrder => bookOrder.Order.UserId == userId && bookOrder.BookId == bookId);

//     // if (!hasPurchased)
//     // {
//     //     return BadRequest("You must purchase the book before reviewing it.");
//     // }

//     var review = new Review
//     {
//         BookId = bookId,
//         UserId = userId,
//         Rating = reviewDto.Rating,
//         Comment = reviewDto.Comment,
//         CreatedAt = DateTime.UtcNow
//     };

//     _context.Reviews.Add(review);
//     await _context.SaveChangesAsync();

//     return Ok(review);
// }
//  // GET: api/reviews/{bookId}
//         [HttpGet("{bookId}")]
//         public async Task<IActionResult> GetReviews(int bookId)
//         {
//             // Fetch reviews for the given bookId
//             var reviews = await _context.Reviews
//                 .Where(review => review.BookId == bookId)
//                 .Include(review => review.User) // Include User details if needed (optional)
//                 .ToListAsync();

//             if (reviews == null || reviews.Count == 0)
//             {
//                 return NotFound("No reviews found for this book.");
//             }

//             // Return the reviews to the client
//             return Ok(reviews);
//         }

// }

// }