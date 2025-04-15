using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BookStore.Models;
namespace BookStore.Data
{
   public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

    public DbSet<Book> Books { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Review> Reviews { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<OrderBook>()
        .HasKey(ob => ob.OrderId); // Or composite key: ob => new { ob.BookId, ob.OrderId }

    modelBuilder.Entity<OrderBook>()
        .HasOne(ob => ob.Book)
        .WithMany(b => b.OrderBooks)
        .HasForeignKey(ob => ob.BookId);

    modelBuilder.Entity<OrderBook>()
        .HasOne(ob => ob.Order)
        .WithMany(o => o.OrderBooks)
        .HasForeignKey(ob => ob.OrderId);
}

}


  
}
