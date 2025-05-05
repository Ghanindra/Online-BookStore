using BookStore.Models;

public class Bookmarks
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }

    public User User { get; set; }  // Optional if navigation needed
    public Book Book { get; set; }  // Include Book info
}
