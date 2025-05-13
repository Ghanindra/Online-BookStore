using System;
using System.ComponentModel.DataAnnotations;

namespace BookStore.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Message { get; set; }

        [Required]
        public DateTime Timestamp { get; set; }
    }
}
