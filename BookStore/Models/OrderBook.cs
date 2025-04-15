using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Models
{
    public class OrderBook
{
    public int OrderId { get; set; }
    public Order Order { get; set; }

    public int BookId { get; set; }
    public Book Book { get; set; }
}

}