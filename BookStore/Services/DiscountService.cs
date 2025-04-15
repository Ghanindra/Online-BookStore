using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookStore.Models;

namespace BookStore.Services
{
    public class DiscountService
{
    public decimal CalculateDiscount(User user, int bookCount, decimal totalPrice)
    {
        decimal discount = 0;

        if (bookCount >= 5)
            discount += 0.05m;

        if (user.SuccessfulOrders >= 10)
            discount += 0.10m;

        return totalPrice * (1 - discount);
    }
}

}