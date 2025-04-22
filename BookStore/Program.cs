// using BookStore.Data;
// using BookStore.Services;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;

// var builder = WebApplication.CreateBuilder(args);
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAll", policy =>
//     {
//         policy.AllowAnyOrigin()
//               .AllowAnyMethod()
//               .AllowAnyHeader();
//     });
// });
// // Add services to the container
// builder.Services.AddControllers();

// // Register DB Context
// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))); // Correct method for PostgreSQL

// // Register DiscountService and EmailService
// builder.Services.AddScoped<DiscountService>();
// builder.Services.AddScoped<IEmailService, EmailService>();

// // JWT Authentication Configuration
// var jwtKey = builder.Configuration["Jwt:Key"];
// if (string.IsNullOrEmpty(jwtKey))
// {
//     throw new ArgumentNullException("Jwt key is not configured properly in appsettings.json");
// }

// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuer = false, // Skip issuer validation
//         ValidateAudience = false, // Skip audience validation
//         ValidateLifetime = true,  // Validate token expiration
//         ValidateIssuerSigningKey = true, // Validate the signing key
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)) // Use the key to sign JWTs
//     };
// });

// // Enable Authorization
// builder.Services.AddAuthorization();

// var app = builder.Build();
// app.UseCors("AllowAll");
// // Use Middleware
// app.UseHttpsRedirection();
// app.UseRouting(); // Make sure routing is enabled
// app.UseAuthentication(); // 🔐 must be before Authorization
// app.UseAuthorization(); // Enable authorization
// app.MapControllers(); // 🧭 Maps your API endpoints

// app.Run(); // 🚀 Starts the web application

using BookStore.Data;
using BookStore.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Update CORS policy to allow credentials
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Specify the origin you want to allow
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Allow credentials (cookies, authorization headers, etc.)
    });
});

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
app.UseCors("AllowSpecificOrigin"); // Apply the specific CORS policy

// Use Middleware
app.UseHttpsRedirection();
app.UseRouting(); // Make sure routing is enabled
app.UseAuthentication(); // 🔐 must be before Authorization
app.UseAuthorization(); // Enable authorization
app.MapControllers(); // 🧭 Maps your API endpoints

app.Run(); // 🚀 Starts the web application
