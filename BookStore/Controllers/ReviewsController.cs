using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BookStore.Data;
using BookStore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BookStore.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ReviewController> _logger;

        public ReviewController(ApplicationDbContext context, ILogger<ReviewController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // [HttpPost]
        // public async Task<IActionResult> AddReview([FromBody] Review review)
        // {
        //     var userIdClaim = User?.FindFirstValue(ClaimTypes.NameIdentifier);
        //     if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        //     {
        //         return Unauthorized("User not authenticated.");
        //     }

        //     // ✅ Check if user ordered the book and order is not canceled
        //     var hasOrderedBook = await _context.Orders
        //         .Where(o => o.UserId == userId && !o.IsCanceled)
        //         .AnyAsync(o => o.Books.Any(b => b.Id == review.BookId));

        //     if (!hasOrderedBook)
        //     {
        //         return BadRequest("You can only review books you have successfully ordered.");
        //     }

        //     // ❗ Optional: Prevent duplicate review for same book by same user
        //     var alreadyReviewed = await _context.Reviews
        //         .AnyAsync(r => r.UserId == userId && r.BookId == review.BookId);

        //     if (alreadyReviewed)
        //     {
        //         return BadRequest("You've already reviewed this book.");
        //     }

        //     // ✅ Create and save review
        //     review.UserId = userId;
        //     review.CreatedAt = DateTime.UtcNow;

        //     _context.Reviews.Add(review);
        //     await _context.SaveChangesAsync();

        //     return Ok("Review submitted successfully.");
        // }
        [HttpPost]
public async Task<IActionResult> AddReview([FromBody] Review review)
{
    var userIdClaim = User?.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
    {
        return Unauthorized("User not authenticated.");
    }

    // Check if user ordered *and* was supplied that book
    var hasSuppliedBook = await _context.Orders
        .Where(o => o.UserId == userId 
                    && !o.IsCanceled 
                    && o.IsSupplied)               // only supplied orders
        .AnyAsync(o => o.Books.Any(b => b.Id == review.BookId));

    if (!hasSuppliedBook)
    {
        return BadRequest("You can only review books that have been supplied to you.");
    }

    // Prevent duplicate review
    var alreadyReviewed = await _context.Reviews
        .AnyAsync(r => r.UserId == userId && r.BookId == review.BookId);

    if (alreadyReviewed)
    {
        return BadRequest("You've already reviewed this book.");
    }

    // Create and save
    review.UserId    = userId;
    review.CreatedAt = DateTime.UtcNow;

    _context.Reviews.Add(review);
    await _context.SaveChangesAsync();

    return Ok("Review submitted successfully.");
}


        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetReviewsForBook(int bookId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.BookId == bookId)
                .Include(r => r.User)
                .Select(r => new
                {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt,
                    User = new { r.User.FullName }
                })
                .ToListAsync();

            return Ok(reviews);
        }
    }
}
