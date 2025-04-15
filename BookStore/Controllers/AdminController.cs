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

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("book")]
public async Task<IActionResult> AddBook(Book book)
{
    book.SaleStart = ConvertToUtc(book.SaleStart);
    book.SaleEnd = ConvertToUtc(book.SaleEnd);

    _context.Books.Add(book);
    await _context.SaveChangesAsync();
    return Ok(book);
}

      private DateTime? ConvertToUtc(DateTime? dateTime)
{
    if (dateTime == null) return null;

    // If the DateTime is unspecified, assume it's local and convert to UTC.
    if (dateTime.Value.Kind == DateTimeKind.Unspecified)
    {
        return DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Local).ToUniversalTime();
    }

    // If it's already UTC, return as is
    if (dateTime.Value.Kind == DateTimeKind.Utc)
        return dateTime;

    // Otherwise, treat as local time and convert to UTC
    return dateTime.Value.ToUniversalTime();
}

        [HttpPut("book/{id}")]
public async Task<IActionResult> UpdateBook(int id, Book updated)
{
    var book = await _context.Books.FindAsync(id);
    if (book == null) return NotFound();

    book.Title = updated.Title;
    book.Price = updated.Price;
    book.Stock = updated.Stock;
    book.IsOnSale = updated.IsOnSale;
    book.DiscountPrice = updated.DiscountPrice;
    book.SaleStart = ConvertToUtc(updated.SaleStart);
    book.SaleEnd = ConvertToUtc(updated.SaleEnd);

    await _context.SaveChangesAsync();
    return Ok(book);
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