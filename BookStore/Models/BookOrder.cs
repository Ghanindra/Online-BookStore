using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Models
{
    public class BookOrder
    {
        public int Id { get; set; }  // Primary Key
    public int OrderId { get; set; }  // Foreign Key to Order
    public int BookId { get; set; }  // Foreign Key to Book
    public int Quantity { get; set; }  // Quantity of the book in the order

    public Book Book { get; set; }  // Navigation Property for Book
    // [NotMapped]
    public Order Order { get; set; }  // Navigation Property for Order
    }
}