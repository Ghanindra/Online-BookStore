using BookStore.Data;
using BookStore.Models;
using BookStore.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders(); // optional - resets default providers
builder.Logging.AddConsole();     // make sure console logging is added
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

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // 100MB, adjust as needed
});
// JWT Authentication Configuration
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new ArgumentNullException("Jwt key is not configured properly in appsettings.json");
}
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

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
// builder.Services.AddIdentity<User, IdentityRole>()
//     .AddEntityFrameworkStores<ApplicationDbContext>()
//     .AddDefaultTokenProviders();

var app = builder.Build();
app.UseStaticFiles(); // Enables serving files from wwwroot by default
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    DbInitializer.SeedUsers(context);
}

// Optional: if you want to serve from a custom "images" folder:
app.UseStaticFiles(); // Default static file serving for wwwroot

// Optional: if you want to serve images from the wwwroot/images folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images")),
    RequestPath = "/images"
});

app.UseCors("AllowSpecificOrigin"); // Apply the specific CORS policy

// Use Middleware
app.UseHttpsRedirection();
app.UseRouting(); // Make sure routing is enabled
app.UseAuthentication(); //  must be before Authorization
app.UseAuthorization(); // Enable authorization
app.MapControllers(); //  Maps your API endpoints

app.Run(); // Starts th