using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.DTOs
{
    public class AddToCartDto
    {
           public int UserId { get; set; }
          public int BookId { get; set; }
    public int Quantity { get; set; }
    }
}