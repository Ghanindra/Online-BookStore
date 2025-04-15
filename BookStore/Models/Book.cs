using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Models
{
   public class Book
{
    public int Id { get; set; }
    public  string? Title { get; set; }
    public  string ?ISBN { get; set; }
    public  string? Author { get; set; }
    public  string ?Genre { get; set; }
    public string? Language { get; set; }
    public  string? Publisher { get; set; }
    public  string ?Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public  string? Format { get; set; } // e.g. Paperback, Hardcover, Signed
    public DateTime PublicationDate { get; set; }
    public bool IsExclusive { get; set; }
    public bool IsOnSale { get; set; }
    public decimal? DiscountPrice { get; set; }
    public DateTime? SaleStart { get; set; }
    public DateTime? SaleEnd { get; set; }
    public  ICollection<Review>? Reviews { get; set; }
       // Navigation property to Orders
    public ICollection<Order> Orders { get; set; } = new List<Order>();
public ICollection<OrderBook> OrderBooks { get; set; }  // <-- Properly defined collection    }
}
}