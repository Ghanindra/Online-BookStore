using Microsoft.AspNetCore.Mvc;
using BookStore.DTOs;
using BookStore.Models;
using BookStore.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

namespace BookStore.Controllers
{
    [Authorize] // Ensure that only authenticated users can access this controller
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register(RegisterDTO dto)
        {
            // Add registration logic here
            return Ok("User registered successfully");
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login(LoginDTO dto)
        {
            // Add login logic here
            return Ok("User logged in successfully");
        }

        // 🚀 ADD TO CART
        [HttpPost("cart/add")]
        public async Task<IActionResult> AddToCart(AddToCartDTO dto)
        {
            // Get the user ID from the authenticated user (JWT token)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // If the user is not authenticated, the [Authorize] attribute will handle this by default
            // No need to manually check for Unauthorized status, it's automatically handled by ASP.NET Core
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            // Convert the userId to an integer
            int userIdInt = int.Parse(userId);

            // Check if the book is already in the user's cart
            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userIdInt && c.BookId == dto.BookId);

            if (existingCartItem != null)
            {
                // If the book is already in the cart, update the quantity
                existingCartItem.Quantity += dto.Quantity;
            }
            else
            {
                // If the book is not in the cart, add a new entry
                var cartItem = new CartItem
                {
                    UserId = userIdInt,
                    BookId = dto.BookId,
                    Quantity = dto.Quantity
                };
                await _context.CartItems.AddAsync(cartItem);
            }

            // Save changes to the database
            await _context.SaveChangesAsync();
            return Ok("Book added to cart");
        }

        // 🗑️ REMOVE FROM CART
        [HttpDelete("cart/remove")]
        public async Task<IActionResult> RemoveFromCart(int bookId)
        {
            // Get the user ID from the authenticated user (JWT token)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // If the user is not authenticated, the [Authorize] attribute will handle this by default
            // No need to manually check for Unauthorized status, it's automatically handled by ASP.NET Core
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            // Convert the userId to an integer
            int userIdInt = int.Parse(userId);

            // Check if the book exists in the user's cart
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userIdInt && c.BookId == bookId);

            if (cartItem == null)
            {
                return NotFound("Book not found in cart");
            }

            // Remove the book from the cart
            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return Ok("Book removed from cart");
        }

        // 📦 GET CART ITEMS
        [HttpGet("cart")]
        public async Task<IActionResult> GetCart()
        {
            // Get the user ID from the authenticated user (JWT token)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // If the user is not authenticated, the [Authorize] attribute will handle this by default
            // No need to manually check for Unauthorized status, it's automatically handled by ASP.NET Core
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            // Convert the userId to an integer
            int userIdInt = int.Parse(userId);

            // Fetch the user's cart items along with the associated book details
            var cartItems = await _context.CartItems
                .Where(c => c.UserId == userIdInt)
                .Include(c => c.Book)
                .ToListAsync();

            return Ok(cartItems);
        }
        [HttpPost("bookmark/add")]
public async Task<IActionResult> AddBookmark(BookmarkDTO dto)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return Unauthorized("User ID not found in token.");

    int userIdInt = int.Parse(userId);
    var bookExists = await _context.Books.AnyAsync(b => b.Id == dto.BookId);
    if (!bookExists)
    {
        return NotFound("Book does not exist.");
    }


    var existingBookmark = await _context.Bookmarks
        .FirstOrDefaultAsync(b => b.UserId == userIdInt && b.BookId == dto.BookId);

    if (existingBookmark != null)
    {
        return BadRequest("Book already bookmarked.");
    }

    var bookmark = new Bookmarks
    {
        UserId = userIdInt,
        BookId = dto.BookId
    };

    await _context.Bookmarks.AddAsync(bookmark);
    await _context.SaveChangesAsync();

    return Ok("Book bookmarked.");
}
[HttpDelete("bookmark/remove")]
public async Task<IActionResult> RemoveBookmark(int bookId)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return Unauthorized("User ID not found in token.");

    int userIdInt = int.Parse(userId);
var bookmark = await _context.Bookmarks
    .FirstOrDefaultAsync(b => b.BookId == bookId); // REMOVE UserId filter temporarily

if (bookmark == null)
{
    return NotFound("Bookmark not found.");
}

    var bookmarks = await _context.Bookmarks
        .FirstOrDefaultAsync(b => b.UserId == userIdInt && b.BookId == bookId);

    if (bookmark == null)
    {
        return NotFound("Bookmark not found.");
    }

    _context.Bookmarks.Remove(bookmark);
    await _context.SaveChangesAsync();

    return Ok("Bookmark removed.");
}
[HttpGet("bookmarks")]
public async Task<IActionResult> GetBookmarks()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return Unauthorized("User ID not found in token.");

    int userIdInt = int.Parse(userId);

    var bookmarks = await _context.Bookmarks
        .Where(b => b.UserId == userIdInt)
        .Include(b => b.Book)
        .ToListAsync();

    return Ok(bookmarks);
}

    }

    // DTOs
    public class AddToCartDTO
    {
        public int BookId { get; set; }
        public int Quantity { get; set; }
    }
}
