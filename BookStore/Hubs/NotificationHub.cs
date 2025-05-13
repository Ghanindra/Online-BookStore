using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using BookStore.Data;
using BookStore.Models;
using System;
using System.Threading.Tasks;

namespace BookStore.Hubs
{
    public class NotificationHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public NotificationHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SendNotification(string message)
        {
            // Log the notification to the console
            Console.WriteLine($"Notification received: {message}");

            // Save the notification to the database
            var notification = new Notification
            {
                Message = message,
                Timestamp = DateTime.UtcNow
            };

           try
{
    _context.Notifications.Add(notification);
    await _context.SaveChangesAsync();
}
catch (Exception ex)
{
    Console.WriteLine("Error saving notification: " + ex.Message);
}

            // Send the notification to all connected clients
            await Clients.All.SendAsync("ReceiveNotification", message);
        }
    }
}