using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BookStore.Models
{
   public class Book
{
    public int Id { get; set; }
    [Required]
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
    public DateTime ?PublicationDate { get; set; }
    public bool IsExclusive { get; set; }
    public bool IsOnSale { get; set; }
    public decimal? DiscountPrice { get; set; }
          public decimal? DiscountPercentage { get;set; }
    public DateTime? SaleStart { get; set; }
    public DateTime? SaleEnd { get; set; }       
    [BindNever]      

   
    public int SalesCount { get; set; }      // For Bestsellers
public bool HasAwards { get; set; }      // For Award Winners
[BindNever]
// public DateTime CreatedAt { get; set; }  // For New Arrivals
public DateTime CreatedAt { get; set; } 
 public bool InStock { get; set; }
    public bool IsPhysicalAccessAvailable { get; set; }
    [MaxLength(1000)] // or use [StringLength(1000)]
    public string? ImageUrl { get; set; }
    
    public  ICollection<Review>? Reviews { get; set; }
    // Navigation property to CartItems
    [JsonIgnore]
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
       // Navigation property to Orders
    public ICollection<Order>? Orders { get; set; } = new List<Order>();
public ICollection<OrderBook>? OrderBooks { get; set; }  // <-- Properly defined collection    }

   public ICollection<BookOrder>? BookOrders { get; set; } // This must be a collection
  
        //   public object OrderBooks { get; internal set; }
        // public object OrderBooks { get; set; }
    }
}