using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookStore.Data;
using BookStore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
   [Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
        private object dto;

        public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

//     [HttpPost("book")]
//     [Consumes("multipart/form-data")]
// public async Task<IActionResult> AddBook([FromForm]Book book,[FromForm] IFormFile image)
// {
//     book.SaleStart = ConvertToUtc(book.SaleStart);
//     book.SaleEnd = ConvertToUtc(book.SaleEnd);

//     // Handle image upload
//     string imagePath = null;
//     if (book.ImageUrl != null && book.ImageUrl.Length > 0)
//     {
//         var uploadsFolder = Path.Combine("wwwroot", "images");
//         if (!Directory.Exists(uploadsFolder))
//         {
//             Directory.CreateDirectory(uploadsFolder);
//         }

//         var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
//         var filePath = Path.Combine(uploadsFolder, uniqueFileName);

//         using (var stream = new FileStream(filePath, FileMode.Create))
//         {
//             await book.ImageUrl.CopyToAsync(stream);
//         }

//         imagePath = $"/images/{uniqueFileName}";
//     }

//     _context.Books.Add(book);
//     await _context.SaveChangesAsync();
//     return Ok(book);
// }

//       private DateTime? ConvertToUtc(DateTime? dateTime)
// {
//     if (dateTime == null) return null;

//     // If the DateTime is unspecified, assume it's local and convert to UTC.
//     if (dateTime.Value.Kind == DateTimeKind.Unspecified)
//     {
//         return DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Local).ToUniversalTime();
//     }

//     // If it's already UTC, return as is
//     if (dateTime.Value.Kind == DateTimeKind.Utc)
//         return dateTime;

//     // Otherwise, treat as local time and convert to UTC
//     return dateTime.Value.ToUniversalTime();
// }

//         [HttpPut("book/{id}")]
// public async Task<IActionResult> UpdateBook(int id, Book updated)
// {
//     var book = await _context.Books.FindAsync(id);
//     if (book == null) return NotFound();

//     book.Title = updated.Title;
//     book.Price = updated.Price;
//     book.Stock = updated.Stock;
//     book.IsOnSale = updated.IsOnSale;
//     book.DiscountPrice = updated.DiscountPrice;
//     book.SaleStart = ConvertToUtc(updated.SaleStart);
//     book.SaleEnd = ConvertToUtc(updated.SaleEnd);

//     await _context.SaveChangesAsync();
//     return Ok(book);
// }


//     [HttpDelete("book/{id}")]
//     public async Task<IActionResult> DeleteBook(int id)
//     {
//         var book = await _context.Books.FindAsync(id);
//         if (book == null) return NotFound();

//         _context.Books.Remove(book);
//         await _context.SaveChangesAsync();
//         return Ok("Deleted.");
//     }
// }
 [HttpPost("book")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> AddBook([FromForm] Book book, [FromForm] IFormFile image)
    {
        book.SaleStart = ConvertToUtc(book.SaleStart);
        book.SaleEnd = ConvertToUtc(book.SaleEnd);
        if (!ModelState.IsValid)
{
    return BadRequest(ModelState); // Returns what field is missing or failed validation
}
if (string.IsNullOrEmpty(book.Language))
{
    book.Language = "English";  // Default value or handle accordingly
}
        // Handle image upload
        if (image != null && image.Length > 0)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            
            // Create folder if it doesn't exist
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generate a unique file name and save the image
            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save the file to the server
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // Set the file path to the book's ImageUrl
            book.ImageUrl = $"/images/{uniqueFileName}";
        }
Console.WriteLine($"Language: {book.Language}");
        // Save the book in the database
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        
        return Ok(book);
    }

    private DateTime? ConvertToUtc(DateTime? dateTime)
    {
        if (dateTime == null) return null;

        if (dateTime.Value.Kind == DateTimeKind.Unspecified)
        {
            return DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Local).ToUniversalTime();
        }

        if (dateTime.Value.Kind == DateTimeKind.Utc)
            return dateTime;

        return dateTime.Value.ToUniversalTime();
    }

    
// [HttpPut("book/{id}")]
// public async Task<IActionResult> UpdateBook(int id, [FromForm] Book updated, [FromForm] IFormFile image)
// {
//     try
//     {
//         if (updated == null) return BadRequest("Invalid book data");

//         var book = await _context.Books.FindAsync(id);
//         if (book == null) return NotFound();

//         // Update book details (excluding the image)
//         book.Title = updated.Title;
//         book.Price = updated.Price;
//         book.Stock = updated.Stock;
//         book.IsOnSale = updated.IsOnSale;
//         book.DiscountPrice = updated.DiscountPrice;
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

//         // Handle image upload if a new image is provided
//         if (image != null && image.Length > 0)
//         {
//             var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            
//             // Create folder if it doesn't exist
//             if (!Directory.Exists(uploadsFolder))
//             {
//                 Directory.CreateDirectory(uploadsFolder);
//             }

//             // Generate a unique file name and save the image
//             var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
//             var filePath = Path.Combine(uploadsFolder, uniqueFileName);

//             // Save the file to the server
//             using (var stream = new FileStream(filePath, FileMode.Create))
//             {
//                 await image.CopyToAsync(stream);
//             }

//             // Update the ImageUrl in the book
//             book.ImageUrl = $"/images/{uniqueFileName}";
//         }

//         // Save updated book details
//         await _context.SaveChangesAsync();
//         return Ok(book);
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine("UpdateBook error: " + ex.Message);
//         return StatusCode(500, "Internal server error");
//     }
// }

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
}
}