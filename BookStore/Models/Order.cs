using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookStore.Models;

namespace BookStore.Models
{
   public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public required User Member { get; set; }
    public int MemberId { get; set; }
  
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public required string ClaimCode { get; set; }
    public bool IsCanceled { get; set; } = false;
    public decimal FinalPrice { get; set; }
      public required List<Book> Books { get; set; }
      public ICollection<OrderBook> OrderBooks { get; set; }

}

}