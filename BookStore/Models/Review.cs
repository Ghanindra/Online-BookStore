using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Models
{
  public class Review
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public required Book Book { get; set; }
    public int UserId { get; set; }
    public required User User { get; set; }
    public int Rating { get; set; }
    public required string Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}

}