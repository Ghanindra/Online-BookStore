using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BookStore.Data;
using BookStore.DTOs;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace BookStore.Controllers
{
   [ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody]RegisterDTO dto)
    {
        if (_context.Users.Any(u => u.Email == dto.Email))
            return BadRequest("Email already exists.");

        var user = new User
        {
            Email = dto.Email,
            
            FullName = dto.FullName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
             IsAdmin = dto.IsAdmin // ✅ Set admin flag from DTO
        };

        _context.Users.Add(user);
        
    var role = user.IsAdmin ? "Admin" : "User";

    var token = GenerateJwt(user, role);

        await _context.SaveChangesAsync();
 return Ok(new
    {
        message = "User registered successfully.",
        token,
        role
    });
    }
    [HttpPost("login")]
public IActionResult Login(LoginDTO dto)
{
    var user = _context.Users.SingleOrDefault(u => u.Email == dto.Email);
    if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        return Unauthorized("Invalid credentials.");

    // Check if the user is an Admin
    var role = user.IsAdmin ? "Admin" : "User";  // Set the role based on user status

    // Generate JWT token with the correct role
    var token = GenerateJwt(user, role);
    return Ok(new { message = "Login successful", token });
}

private string GenerateJwt(User user, string role)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, role) // Include the user's role
    };

#pragma warning disable CS8604 // Possible null reference argument.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
#pragma warning restore CS8604 // Possible null reference argument.
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.Now.AddDays(7),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}


}

}