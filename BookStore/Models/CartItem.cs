using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Models
{
   public class CartItem
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public int Quantity { get; set; }

    public Book Book { get; set; }
    public User User { get; set; }
}

}