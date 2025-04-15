using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookStore.DTOs
{
 public class RegisterDTO
{
  [Required]
  public string Email { get; set; }
[Required]
    public  string Password { get; set; }
    [Required]
    public string FullName { get; set; }
    public bool IsAdmin { get; set; } // ✅ Add this field
}

}