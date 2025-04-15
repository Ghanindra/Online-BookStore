using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.DTOs
{public class BookDTO
    {
        public string Title { get; set; } = string.Empty;
        public string ISBN { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}