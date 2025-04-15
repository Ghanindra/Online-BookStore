using Microsoft.AspNetCore.Mvc;
using BookStore.DTOs;

namespace BookStore.Controllers
{
 
namespace BookStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        [HttpPost("register")]
        public IActionResult Register(RegisterDTO dto)
        {
            // Add registration logic here
            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDTO dto)
        {
            // Add login logic here
            return Ok("User logged in successfully");
        }
    }
}

}
