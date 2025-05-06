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

// [HttpGet("filter")]
// public async Task<IActionResult> FilterBooks(string? category, string? sortBy, string? sortDirection = "asc")
// {
//     var now = DateTime.UtcNow;
//     var query = _context.Books.Include(b => b.Reviews).AsQueryable();

//     switch (category?.ToLower())
//     {
//         case "bestsellers":
//             query = query.OrderByDescending(b => b.SalesCount);
//             break;
//         case "awardwinners":
//             query = query.Where(b => b.HasAwards == true);
//             break;
//         case "newreleases":
//             query = query.Where(b => b.PublicationDate <= now);
//             break;
//         case "newarrivals":
//             query = query.Where(b => b.PublicationDate >= now.AddMonths(-1));
//             break;
//         case "comingsoon":
//             query = query.Where(b => b.PublicationDate > now);
//             break;
//         case "deals":
//             query = query.Where(b => b.DiscountPrice > 0);
//             break;
//         case "all":
//         default:
//             break;
//     }

//     // Apply Sorting
//     if (!string.IsNullOrEmpty(sortBy))
//     {
//         switch (sortBy.ToLower())
//         {
//             case "title":
//                 query = sortDirection == "desc" ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title);
//                 break;
//             case "price":
//                 query = sortDirection == "desc" ? query.OrderByDescending(b => b.Price) : query.OrderBy(b => b.Price);
//                 break;
//             case "publicationdate":
//                 query = sortDirection == "desc" ? query.OrderByDescending(b => b.PublicationDate) : query.OrderBy(b => b.PublicationDate);
//                 break;
//         }
//     }

//     var books = await query.ToListAsync();
//     return Ok(books);
// }


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
[HttpGet("filter")]
public async Task<IActionResult> FilterBooks(
    string? category, 
    string? sortBy, 
    string? sortDirection = "asc", 
    string? author = null,
    string? genre = null,
    decimal? minPrice = null,
    decimal? maxPrice = null,
    double? minRating = null,
    string? language = null,
    string? format = null)
{
    var now = DateTime.UtcNow;
    var query = _context.Books.Include(b => b.Reviews).AsQueryable();

    // Category-based filtering
    switch (category?.ToLower())
    {
        case "bestsellers":
            query = query.OrderByDescending(b => b.SalesCount);
            break;
        case "awardwinners":
            query = query.Where(b => b.HasAwards == true);
            break;
        case "newreleases":
            query = query.Where(b => b.PublicationDate <= now);
            break;
        case "newarrivals":
            query = query.Where(b => b.PublicationDate >= now.AddMonths(-1));
            break;
        case "comingsoon":
            query = query.Where(b => b.PublicationDate > now);
            break;
        case "deals":
            query = query.Where(b => b.DiscountPrice > 0);
            break;
        case "all":
        default:
            break;
    }

    // Apply Filters
    if (!string.IsNullOrEmpty(author))
    {
        query = query.Where(b => EF.Functions.Like(b.Author, $"%{author}%"));
    }

    if (!string.IsNullOrEmpty(genre))
    {
        query = query.Where(b => EF.Functions.Like(b.Genre, "%" + genre + "%"));
    }

    if (minPrice.HasValue)
    {
        query = query.Where(b => b.Price >= minPrice.Value);
    }

    if (maxPrice.HasValue)
    {
        query = query.Where(b => b.Price <= maxPrice.Value);
    }

    if (minRating.HasValue)
    {
        query = query.Where(b => b.Reviews.Average(r => r.Rating) >= minRating.Value);
    }

    if (!string.IsNullOrEmpty(language))
    {
        query = query.Where(b => EF.Functions.Like(b.Language, "%" + language + "%"));
    }

    if (!string.IsNullOrEmpty(format))
    {
        query = query.Where(b => EF.Functions.Like(b.Format, "%" + format + "%"));
    }

    // Apply Sorting
    if (!string.IsNullOrEmpty(sortBy))
    {
        switch (sortBy.ToLower())
        {
            case "title":
                query = sortDirection == "desc" ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title);
                break;
            case "price":
                query = sortDirection == "desc" ? query.OrderByDescending(b => b.Price) : query.OrderBy(b => b.Price);
                break;
            case "publicationdate":
                query = sortDirection == "desc" ? query.OrderByDescending(b => b.PublicationDate) : query.OrderBy(b => b.PublicationDate);
                break;
        }
    }

    var books = await query.ToListAsync();
    return Ok(books);
}



[HttpGet("physical")]
public async Task<IActionResult> GetPhysicalBooks()
{
    var books = await _context.Books
        .Include(b => b.Reviews)
        .Where(b => b.IsPhysicalAccessAvailable == true)
        .ToListAsync();

    return Ok(books);
}

    }
}
