using System;
using System.Collections.Generic;

namespace BookStore.Models
{
    public class Discount
    {
        public int Id { get; set; }
        public string DiscountCode { get; set; } = Guid.NewGuid().ToString().Substring(0, 8); // Generate a unique discount code by default
        public decimal DiscountPercentage { get; set; } // The discount percentage
        public DateTime StartDate { get; set; } // When the discount starts
        public DateTime EndDate { get; set; } // When the discount ends
        public bool IsActive { get; set; } = true; // Whether the discount is currently active
        public string Description { get; set; } // Optional description of the discount
        public ICollection<BookDiscount> BookDiscounts { get; set; } // Navigation property to BookDiscount (many-to-many relation)

        // Constructor
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public Discount()
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        {
            BookDiscounts = new List<BookDiscount>();
        }
    }

    // Join Table for Many-to-Many relationship between Books and Discounts
    public class BookDiscount
    {
        public int BookId { get; set; }
        public required Book Book { get; set; }
        
        public int DiscountId { get; set; }
        public required Discount Discount { get; set; }
    }
}
