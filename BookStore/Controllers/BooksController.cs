// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using BookStore.Data;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;

// namespace BookStore.Controllers
// {
//    [ApiController]
// [Route("api/[controller]")]
// public class BooksController : ControllerBase
// {
//     private readonly ApplicationDbContext _context;

//     public BooksController(ApplicationDbContext context)
//     {
//         _context = context;
//     }

//     [HttpGet]
//     public async Task<IActionResult> GetBooks(string? title, string? author, string? genre, string? format, 
//         decimal? minPrice, decimal? maxPrice, string? sortBy)
//     {
//         var query = _context.Books.AsQueryable();

//         if (!string.IsNullOrEmpty(title))
//             query = query.Where(b => b.Title.Contains(title));
//         if (!string.IsNullOrEmpty(author))
//             query = query.Where(b => b.Author.Contains(author));
//         if (!string.IsNullOrEmpty(genre))
//             query = query.Where(b => b.Genre == genre);
//         if (!string.IsNullOrEmpty(format))
//             query = query.Where(b => b.Format == format);
//         if (minPrice.HasValue)
//             query = query.Where(b => b.Price >= minPrice.Value);
//         if (maxPrice.HasValue)
//             query = query.Where(b => b.Price <= maxPrice.Value);

//         query = sortBy switch
//         {
//             "price" => query.OrderBy(b => b.Price),
//             "title" => query.OrderBy(b => b.Title),
//             "popularity" => query.OrderByDescending(b => b.Reviews.Count),
//             _ => query
//         };

//         var books = await query.ToListAsync();
//         return Ok(books);
//     }
// }

// }

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

        // GET: api/books?title=abc&author=xyz&minPrice=10&sortBy=price
        // [HttpGet]
        // public async Task<IActionResult> GetBooks(
        //     string? title,
        //     string? author,
        //     string? genre,
        //     string? format,
        //     decimal? minPrice,
        //     decimal? maxPrice,
        //     string? sortBy
        // )
        // {
        //     var query = _context.Books
        //         .Include(b => b.Reviews)
        //         .AsQueryable();

        //     if (!string.IsNullOrEmpty(title))
        //         query = query.Where(b => b.Title.Contains(title));

        //     if (!string.IsNullOrEmpty(author))
        //         query = query.Where(b => b.Author.Contains(author));

        //     if (!string.IsNullOrEmpty(genre))
        //         query = query.Where(b => b.Genre == genre);

        //     if (!string.IsNullOrEmpty(format))
        //         query = query.Where(b => b.Format == format);

        //     if (minPrice.HasValue)
        //         query = query.Where(b => b.Price >= minPrice.Value);

        //     if (maxPrice.HasValue)
        //         query = query.Where(b => b.Price <= maxPrice.Value);

        //     query = sortBy switch
        //     {
        //         "price" => query.OrderBy(b => b.Price),
        //         "title" => query.OrderBy(b => b.Title),
        //         "popularity" => query.OrderByDescending(b => b.Reviews.Count),
        //         _ => query
        //     };

        //     var books = await query.ToListAsync();
        //     return Ok(books);
        // }
   
        // GET: api/books/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookById(int id)
        {
            var book = await _context.Books
                .Include(b => b.Reviews)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                return NotFound("Book not found.");

            return Ok(book);
        }
        [HttpGet("filter")]
public async Task<IActionResult> FilterBooks(string? category)
{
    var now = DateTime.UtcNow;
    var query = _context.Books.Include(b => b.Reviews).AsQueryable();

    switch (category?.ToLower())
    {
        case "bestsellers":
            query = query.OrderByDescending(b => b.SalesCount); // Assume you have a SalesCount field
            break;

        case "awardwinners":
            query = query.Where(b => b.HasAwards == true); // Assume you have a HasAwards field
            break;

        case "newreleases":
            query = query.Where(b => b.PublicationDate >= now.AddMonths(-3));
            break;

        case "newarrivals":
            query = query.Where(b => b.CreatedAt >= now.AddMonths(-1)); // when book was added to system
            break;

        case "comingsoon":
            query = query.Where(b => b.PublicationDate > now);
            break;

        case "deals":
            query = query.Where(b => b.DiscountPrice > 0); // Assume discount field
            break;

        case "all":
        default:
            // no filters applied
            break;
    }
   
    var books = await query.ToListAsync();
    return Ok(books);
}

[HttpGet]
public async Task<IActionResult> GetBooks(
    string? title,
    string? author,
    string? genre,
    string? format,
    decimal? minPrice,
    decimal? maxPrice,
    string? language,
    string? publisher,
    string? isbn,
    string? description,
    double? minRating,
    bool? inStock,
    bool? isPhysical,
    string? sortBy,
    string? sortDirection = "asc"
)
{
    var query = _context.Books
        .Include(b => b.Reviews)
        .AsQueryable();

    if (!string.IsNullOrEmpty(title))
        query = query.Where(b => b.Title.Contains(title));

    if (!string.IsNullOrEmpty(author))
        query = query.Where(b => b.Author.Contains(author));

    if (!string.IsNullOrEmpty(genre))
        query = query.Where(b => b.Genre == genre);

    if (!string.IsNullOrEmpty(format))
        query = query.Where(b => b.Format == format);

    if (!string.IsNullOrEmpty(language))
        query = query.Where(b => b.Language == language);

    if (!string.IsNullOrEmpty(publisher))
        query = query.Where(b => b.Publisher == publisher);

    if (!string.IsNullOrEmpty(isbn))
        query = query.Where(b => b.ISBN.Contains(isbn));

    if (!string.IsNullOrEmpty(description))
        query = query.Where(b => b.Description.Contains(description));

    if (minPrice.HasValue)
        query = query.Where(b => b.Price >= minPrice.Value);

    if (maxPrice.HasValue)
        query = query.Where(b => b.Price <= maxPrice.Value);

    if (minRating.HasValue)
        query = query.Where(b => b.Reviews.Any() && b.Reviews.Average(r => r.Rating) >= minRating.Value);

    if (inStock.HasValue)
        query = query.Where(b => b.InStock == inStock);

    if (isPhysical.HasValue)
        query = query.Where(b => b.IsPhysicalAccessAvailable == isPhysical);

    query = (sortBy?.ToLower(), sortDirection?.ToLower()) switch
    {
        ("price", "desc") => query.OrderByDescending(b => b.Price),
        ("price", _) => query.OrderBy(b => b.Price),

        ("title", "desc") => query.OrderByDescending(b => b.Title),
        ("title", _) => query.OrderBy(b => b.Title),

        ("popularity", _) => query.OrderByDescending(b => b.Reviews.Count),

        ("date", "desc") => query.OrderByDescending(b => b.PublicationDate),
        ("date", _) => query.OrderBy(b => b.PublicationDate),

        ("rating", _) => query.OrderByDescending(b => b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : 0),

        _ => query.OrderBy(b => b.Title) // default sort
    };

    var books = await query.ToListAsync();
    return Ok(books);
}

    }
}
