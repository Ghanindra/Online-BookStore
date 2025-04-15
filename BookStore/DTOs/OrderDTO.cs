using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.DTOs
{
   public class OrderDTO
    {
        public int UserId { get; set; }
        public List<int> BookIds { get; set; } = new List<int>();
        public DateTime OrderDate { get; set; }
        public string ClaimCode { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }
}