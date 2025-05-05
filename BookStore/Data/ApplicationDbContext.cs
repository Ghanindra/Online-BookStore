
using Microsoft.EntityFrameworkCore;
using BookStore.Models;
using System.ComponentModel.DataAnnotations.Schema;


namespace BookStore.Data
{
  
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

    [NotMapped]
    public DbSet<Book> Books { get; set; }

    [NotMapped]
    public DbSet<Order> Orders { get; set; }
 public DbSet<CartItem> CartItems { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Review> Reviews { get; set; }
      public DbSet<BookOrder> BookOrders { get; set; }  // Add this
    // public DbSet<OrderBook> OrderBooks { get; set; }

public DbSet<Bookmarks> Bookmarks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>().ToTable("Books");
        modelBuilder.Entity<Order>().ToTable("Orders");

        modelBuilder.Entity<OrderBook>()
            .HasKey(ob => new { ob.BookId, ob.OrderId });
{
    modelBuilder.Entity<Book>()
        .Ignore(b => b.OrderBooks);
}
        modelBuilder.Entity<OrderBook>()
            .HasOne(ob => ob.Book)
            .WithMany(static b => b.OrderBooks)
            .HasForeignKey(ob => ob.BookId);

        modelBuilder.Entity<OrderBook>()
            .HasOne(ob => ob.Order)
            .WithMany(o => o.OrderBooks)
            .HasForeignKey(ob => ob.OrderId);
            {
   {
    modelBuilder.Entity<CartItem>()
        .ToTable("cartitems");

    modelBuilder.Entity<CartItem>()
        .HasKey(c => c.Id); // This is usually inferred, but you can explicitly set it if needed

    modelBuilder.Entity<CartItem>()
        .HasOne(c => c.Book)
        .WithMany(b => b.CartItems)
        .HasForeignKey(c => c.BookId);

    modelBuilder.Entity<CartItem>()
        .HasOne(c => c.User)
        .WithMany(u => u.CartItems)
        .HasForeignKey(c => c.UserId);
}
}


    modelBuilder.Entity<Bookmarks>()
    .HasOne(b => b.Book)
    .WithMany()
    .HasForeignKey(b => b.BookId);

     modelBuilder.Entity<BookOrder>()
        .HasOne(bo => bo.Book)
        .WithMany(b => b.BookOrders)
        .HasForeignKey(bo => bo.BookId);
         modelBuilder.Entity<BookOrder>()
        .HasOne(bo => bo.Order)
        .WithMany(o => o.BookOrders) // Adjust this if the relationship is one-to-one
        .HasForeignKey(bo => bo.OrderId); // Ensure this property exists


        base.OnModelCreating(modelBuilder);
    }
    
}


}
