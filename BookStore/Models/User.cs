using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.Models
{
 public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string FullName { get; set; }
    public string MembershipId { get; set; } = Guid.NewGuid().ToString().Substring(0, 8);
    public bool IsAdmin { get; set; }
    public int SuccessfulOrders { get; set; }
 public List<Bookmark> Bookmarks { get; set; } = new List<Bookmark>(); // Initialize with an empty list
}

   public class Bookmark
    {
        public int Id { get; set; }  // Primary key for Bookmark
        public required string Title { get; set; }  // Add properties for the bookmark
        public required string URL { get; set; }  // URL of the bookmarked page
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Date the bookmark was created
        public int UserId { get; set; }  // Foreign key to the User

        // Navigation property for the associated User
        public required User User { get; set; }  
    }
}