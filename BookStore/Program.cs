using BookStore.Data;
using BookStore.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Register DB Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))); // Correct method for PostgreSQL

// Register DiscountService and EmailService
builder.Services.AddScoped<DiscountService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// JWT Authentication Configuration
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new ArgumentNullException("Jwt key is not configured properly in appsettings.json");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false, // Skip issuer validation
        ValidateAudience = false, // Skip audience validation
        ValidateLifetime = true,  // Validate token expiration
        ValidateIssuerSigningKey = true, // Validate the signing key
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)) // Use the key to sign JWTs
    };
});

// Enable Authorization
builder.Services.AddAuthorization();

var app = builder.Build();

// Use Middleware
app.UseHttpsRedirection();
app.UseRouting(); // Make sure routing is enabled
app.UseAuthentication(); // 🔐 must be before Authorization
app.UseAuthorization(); // Enable authorization
app.MapControllers(); // 🧭 Maps your API endpoints

app.Run(); // 🚀 Starts the web application
