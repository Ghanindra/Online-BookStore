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
    [Authorize]
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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.BookId == dto.BookId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += dto.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = userId,
                    BookId = dto.BookId,
                    Quantity = dto.Quantity
                };
                await _context.CartItems.AddAsync(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok("Book added to cart");
        }

        // 🗑️ REMOVE FROM CART
        [HttpDelete("cart/remove")]
        public async Task<IActionResult> RemoveFromCart(int bookId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.BookId == bookId);

            if (cartItem == null)
                return NotFound("Book not found in cart");

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return Ok("Book removed from cart");
        }

        // 📦 GET CART ITEMS
        [HttpGet("cart")]
        public async Task<IActionResult> GetCart()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var cartItems = await _context.CartItems
                .Where(c => c.UserId == userId)
                .Include(c => c.Book)
                .ToListAsync();

            return Ok(cartItems);
        }
    }

    // DTOs
    public class AddToCartDTO
    {
        public int BookId { get; set; }
        public int Quantity { get; set; }
    }
}
