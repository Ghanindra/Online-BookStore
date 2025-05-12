// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using BookStore.Data;
// using BookStore.Models;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;

// namespace BookStore.Controllers
// {
//    [Authorize(Roles = "Admin")]
// [ApiController]
// [Route("api/[controller]")]
// public class AdminController : ControllerBase
// {
//     private readonly ApplicationDbContext _context;
//         private object dto;

//         public AdminController(ApplicationDbContext context)
//     {
//         _context = context;
//     }

// //  [HttpPost("book")]
// //     [Consumes("multipart/form-data")]
// //     public async Task<IActionResult> AddBook([FromForm] Book book, [FromForm] IFormFile image)
// //     {

// //         book.SaleStart = ConvertToUtc(book.SaleStart);
// //         book.SaleEnd = ConvertToUtc(book.SaleEnd);
// //         book.PublicationDate = ConvertToUtc(book.PublicationDate);
// //           // Automatically set CreatedAt to the current UTC time
// //     book.CreatedAt = DateTime.UtcNow;

// //         if (!ModelState.IsValid)
// // {
// //     return BadRequest(ModelState); // Returns what field is missing or failed validation
// // }
// // if (string.IsNullOrEmpty(book.Language))
// // {
// //     book.Language = "English";  // Default value or handle accordingly
// // }
// //         // Handle image upload
// //         if (image != null && image.Length > 0)
// //         {
// //             var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            
// //             // Create folder if it doesn't exist
// //             if (!Directory.Exists(uploadsFolder))
// //             {
// //                 Directory.CreateDirectory(uploadsFolder);
// //             }

// //             // Generate a unique file name and save the image
// //             var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
// //             var filePath = Path.Combine(uploadsFolder, uniqueFileName);

// //             // Save the file to the server
// //             using (var stream = new FileStream(filePath, FileMode.Create))
// //             {
// //                 await image.CopyToAsync(stream);
// //             }

// //             // Set the file path to the book's ImageUrl
// //             book.ImageUrl = $"/images/{uniqueFileName}";
// //         }
// // Console.WriteLine($"Language: {book.Language}");
// //         // Save the book in the database
// //         _context.Books.Add(book);
// //         await _context.SaveChangesAsync();
        
// //         return Ok(book);
// //     }

// //     private DateTime? ConvertToUtc(DateTime? dateTime)
// //     {
// //         if (dateTime == null) return null;

// //         if (dateTime.Value.Kind == DateTimeKind.Unspecified)
// //         {
// //             return DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Local).ToUniversalTime();
// //         }

// //         if (dateTime.Value.Kind == DateTimeKind.Utc)
// //             return dateTime;

// //         return dateTime.Value.ToUniversalTime();
// //     }

// // [HttpPut("book/{id}")]
// // public async Task<IActionResult> UpdateBook(int id, [FromForm] Book updated, [FromForm] IFormFile ?image)
// // {
// //     try
// //     {
// //         if (updated == null) return BadRequest("Invalid book data");

// //         var book = await _context.Books.FindAsync(id);
// //         if (book == null) return NotFound();

// //         // Update all fields
// //         book.Title = updated.Title;
// //         book.Price = updated.Price;
// //         book.Stock = updated.Stock;
// //         book.IsOnSale = updated.IsOnSale;
// //         book.DiscountPrice = updated.DiscountPrice;
// //         book.SaleStart = ConvertToUtc(updated.SaleStart);
// //         book.SaleEnd = ConvertToUtc(updated.SaleEnd);
// //         book.Language = updated.Language;
// //         book.ISBN = updated.ISBN;
// //         book.Genre = updated.Genre;
// //         book.Publisher = updated.Publisher;
// //         book.Description = updated.Description;
// //         book.Format = updated.Format;
// //         book.IsExclusive = updated.IsExclusive;
// //         book.InStock = updated.InStock;
// //         book.IsPhysicalAccessAvailable = updated.IsPhysicalAccessAvailable;

// //         // Only update ImageUrl if new image is provided
// //         if (image != null && image.Length > 0)
// //         {
// //             var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
// //             if (!Directory.Exists(uploadsFolder))
// //             {
// //                 Directory.CreateDirectory(uploadsFolder);
// //             }

// //             var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
// //             var filePath = Path.Combine(uploadsFolder, uniqueFileName);

// //             using (var stream = new FileStream(filePath, FileMode.Create))
// //             {
// //                 await image.CopyToAsync(stream);
// //             }

// //             book.ImageUrl = $"/images/{uniqueFileName}";
// //         }
// //         // Else: keep the existing book.ImageUrl

// //         await _context.SaveChangesAsync();
// //         return Ok(book);
// //     }
// //     catch (Exception ex)
// //     {
// //         Console.WriteLine("UpdateBook error: " + ex.Message);
// //         return StatusCode(500, "Internal server error");
// //     }
// // }



// [HttpPost("book")]
// [Consumes("multipart/form-data")]
// public async Task<IActionResult> AddBook([FromForm] Book book, [FromForm] IFormFile image)
// {
//     book.SaleStart = ConvertToUtc(book.SaleStart);
//     book.SaleEnd = ConvertToUtc(book.SaleEnd);
//     book.PublicationDate = ConvertToUtc(book.PublicationDate);
//     book.CreatedAt = DateTime.UtcNow;

//     if (!ModelState.IsValid)
//     {
//         return BadRequest(ModelState); // Returns what field is missing or failed validation
//     }

//     if (string.IsNullOrEmpty(book.Language))
//     {
//         book.Language = "English";  // Default value or handle accordingly
//     }

//     // Calculate Discount Percentage if the book is on sale
//     if (book.IsOnSale && book.DiscountPrice > 0)
//     {
//         book.DiscountPercentage = (1 - (book.DiscountPrice / book.Price)) * 100;
//     }

//     // Handle image upload
//     if (image != null && image.Length > 0)
//     {
//         var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

//         if (!Directory.Exists(uploadsFolder))
//         {
//             Directory.CreateDirectory(uploadsFolder);
//         }

//         var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
//         var filePath = Path.Combine(uploadsFolder, uniqueFileName);

//         using (var stream = new FileStream(filePath, FileMode.Create))
//         {
//             await image.CopyToAsync(stream);
//         }

//         book.ImageUrl = $"/images/{uniqueFileName}";
//     }

//     Console.WriteLine($"Language: {book.Language}");
//     _context.Books.Add(book);
//     await _context.SaveChangesAsync();

//     return Ok(book);
// }

// [HttpPut("book/{id}")]
// public async Task<IActionResult> UpdateBook(int id, [FromForm] Book updated, [FromForm] IFormFile? image)
// {
//     try
//     {
//         if (updated == null) return BadRequest("Invalid book data");

//         var book = await _context.Books.FindAsync(id);
//         if (book == null) return NotFound();

//         // Update fields
//         book.Title = updated.Title;
//         book.Price = updated.Price;
//         book.Stock = updated.Stock;
//         book.IsOnSale = updated.IsOnSale;
//         book.SaleStart = ConvertToUtc(updated.SaleStart);
//         book.SaleEnd = ConvertToUtc(updated.SaleEnd);
//         book.Language = updated.Language;
//         book.ISBN = updated.ISBN;
//         book.Genre = updated.Genre;
//         book.Publisher = updated.Publisher;
//         book.Description = updated.Description;
//         book.Format = updated.Format;
//         book.IsExclusive = updated.IsExclusive;
//         book.InStock = updated.InStock;
//         book.IsPhysicalAccessAvailable = updated.IsPhysicalAccessAvailable;

//         // Calculate Discount Percentage if on sale
//         if (updated.IsOnSale && updated.DiscountPrice > 0)
//         {
//             book.DiscountPercentage = (1 - (updated.DiscountPrice / updated.Price)) * 100;
//         }
//         else
//         {
//             book.DiscountPercentage = null; // Reset the Discount Percentage if not on sale
//         }

//         // Handle image upload (if provided)
//         if (image != null && image.Length > 0)
//         {
//             var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

//             if (!Directory.Exists(uploadsFolder))
//             {
//                 Directory.CreateDirectory(uploadsFolder);
//             }

//             var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
//             var filePath = Path.Combine(uploadsFolder, uniqueFileName);

//             using (var stream = new FileStream(filePath, FileMode.Create))
//             {
//                 await image.CopyToAsync(stream);
//             }

//             book.ImageUrl = $"/images/{uniqueFileName}";
//         }

//         await _context.SaveChangesAsync();
//         return Ok(book);
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine("UpdateBook error: " + ex.Message);
//         return StatusCode(500, "Internal server error");
//     }
// }

//         private DateTime? ConvertToUtc(DateTime? saleStart)
//         {
//             throw new NotImplementedException();
//         }

//         [HttpDelete("book/{id}")]
//     public async Task<IActionResult> DeleteBook(int id)
//     {
//         var book = await _context.Books.FindAsync(id);
//         if (book == null) return NotFound();

//         _context.Books.Remove(book);
//         await _context.SaveChangesAsync();
//         return Ok("Deleted.");
//     }




// }

// }



using System;
using System.IO;
using System.Threading.Tasks;
using BookStore.Data;
using BookStore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("book")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddBook([FromForm] Book book, [FromForm] IFormFile image)
        {
            book.SaleStart = book.SaleStart;
            book.SaleEnd = book.SaleEnd;
            book.PublicationDate = book.PublicationDate;
            book.CreatedAt = DateTime.UtcNow;

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrEmpty(book.Language))
                book.Language = "English";

            if (book.IsOnSale && book.DiscountPrice > 0)
                book.DiscountPercentage = book.DiscountPrice / book.Price * 100;

            if (image != null && image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                book.ImageUrl = $"/images/{uniqueFileName}";
            }

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(book);
        }

       [HttpPut("book/{id}")]
public async Task<IActionResult> UpdateBook(int id, [FromForm] Book updated, [FromForm] IFormFile ?image)
{
    try
    {
        if (updated == null) return BadRequest("Invalid book data");

        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();

        // Update all fields
        book.Title = updated.Title;
        book.Price = updated.Price;
        book.Stock = updated.Stock;
        book.IsOnSale = updated.IsOnSale;
        book.DiscountPrice = updated.DiscountPrice;
        book.SaleStart = ConvertToUtc(updated.SaleStart);
        book.SaleEnd = ConvertToUtc(updated.SaleEnd);
        book.Language = updated.Language;
        book.ISBN = updated.ISBN;
        book.Genre = updated.Genre;
        book.Publisher = updated.Publisher;
        book.Description = updated.Description;
        book.Format = updated.Format;
        book.IsExclusive = updated.IsExclusive;
        book.InStock = updated.InStock;
        book.IsPhysicalAccessAvailable = updated.IsPhysicalAccessAvailable;

        // Only update ImageUrl if new image is provided
        if (image != null && image.Length > 0)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            book.ImageUrl = $"/images/{uniqueFileName}";
        }
        // Else: keep the existing book.ImageUrl

        await _context.SaveChangesAsync();
        return Ok(book);
    }
    catch (Exception ex)
    {
        Console.WriteLine("UpdateBook error: " + ex.Message);
        return StatusCode(500, "Internal server error");
    }
}

        [HttpDelete("book/{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return Ok("Deleted.");
        }

        private DateTime? ConvertToUtc(DateTime? dateTime)
        {
            if (dateTime == null) return null;

            if (dateTime.Value.Kind == DateTimeKind.Unspecified)
            {
                return DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Local).ToUniversalTime();
            }

            return dateTime.Value.ToUniversalTime();
        }

         [HttpPost("banner")]
    public async Task<IActionResult> CreateBanner([FromBody] Banner banner)
    {
        // Ensure required fields are provided
        if (banner == null)
            return BadRequest("Banner data is required.");

        // Validate time logic
        if (banner.StartTime >= banner.EndTime)
            return BadRequest("Start time must be earlier than end time.");

        // Force UTC to avoid PostgreSQL DateTime kind errors
        banner.StartTime = banner.StartTime.ToUniversalTime();
        banner.EndTime = banner.EndTime.ToUniversalTime();

        _context.Banners.Add(banner);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAllBanners), new { id = banner.Id }, banner);
    }

    [HttpPut("banner/{id}")]
    public async Task<IActionResult> UpdateBanner(int id, [FromBody] Banner updatedBanner)
    {
        var banner = await _context.Banners.FindAsync(id);
        if (banner == null)
            return NotFound($"Banner with ID {id} not found.");

        if (updatedBanner.StartTime >= updatedBanner.EndTime)
            return BadRequest("Start time must be earlier than end time.");

        // Enforce UTC
        banner.Message = updatedBanner.Message;
        banner.StartTime = updatedBanner.StartTime.ToUniversalTime();
        banner.EndTime = updatedBanner.EndTime.ToUniversalTime();
        banner.IsActive = updatedBanner.IsActive;

        await _context.SaveChangesAsync();
        return Ok(banner);
    }

    [HttpDelete("banner/{id}")]
    public async Task<IActionResult> DeleteBanner(int id)
    {
        var banner = await _context.Banners.FindAsync(id);
        if (banner == null)
            return NotFound($"Banner with ID {id} not found.");

        _context.Banners.Remove(banner);
        await _context.SaveChangesAsync();
        return NoContent();
    }

   [HttpGet("banners")]
public async Task<IActionResult> GetAllBanners()
{
    var banners = await _context.Banners.ToListAsync();
    return Ok(banners);
}

    }
}
