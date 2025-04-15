using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BookStore.Data;
using BookStore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("{bookId}")]
    public async Task<IActionResult> AddReview(int bookId, Review review)
    {
#pragma warning disable CS8604 // Possible null reference argument.
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
#pragma warning restore CS8604 // Possible null reference argument.

            review.BookId = bookId;
        review.UserId = userId;
        review.CreatedAt = DateTime.Now;

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(review);
    }
}

}