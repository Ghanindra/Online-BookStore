using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookStore.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Controllers
{
   [ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BooksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetBooks(string? title, string? author, string? genre, string? format, 
        decimal? minPrice, decimal? maxPrice, string? sortBy)
    {
        var query = _context.Books.AsQueryable();

        if (!string.IsNullOrEmpty(title))
            query = query.Where(b => b.Title.Contains(title));
        if (!string.IsNullOrEmpty(author))
            query = query.Where(b => b.Author.Contains(author));
        if (!string.IsNullOrEmpty(genre))
            query = query.Where(b => b.Genre == genre);
        if (!string.IsNullOrEmpty(format))
            query = query.Where(b => b.Format == format);
        if (minPrice.HasValue)
            query = query.Where(b => b.Price >= minPrice.Value);
        if (maxPrice.HasValue)
            query = query.Where(b => b.Price <= maxPrice.Value);

        query = sortBy switch
        {
            "price" => query.OrderBy(b => b.Price),
            "title" => query.OrderBy(b => b.Title),
            "popularity" => query.OrderByDescending(b => b.Reviews.Count),
            _ => query
        };

        var books = await query.ToListAsync();
        return Ok(books);
    }
}

}