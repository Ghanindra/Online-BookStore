using BookStore.Models;
using Microsoft.Extensions.Logging;

public class DiscountService
{
    private readonly ILogger<DiscountService> _logger;

    public DiscountService(ILogger<DiscountService> logger)
    {
        _logger = logger;
    }

    public decimal CalculateDiscount(User user, int bookCount, decimal totalPrice)
    {
        decimal discountPercentage = 0;

        if (bookCount >= 5)
            discountPercentage += 0.05m;

        if (user.SuccessfulOrders >= 10)
            discountPercentage += 0.10m;

        _logger.LogInformation("User has {SuccessfulOrders} successful orders.", user.SuccessfulOrders);
        _logger.LogInformation("Discount Percentage Applied: {DiscountPercentage:P}", discountPercentage);

        decimal discountAmount = totalPrice * discountPercentage;
        decimal finalPrice = totalPrice - discountAmount;

        _logger.LogInformation("Discount Amount: {DiscountAmount}", discountAmount);
        _logger.LogInformation("Final Price after discount: {FinalPrice}", finalPrice);

        return finalPrice;
    }
}
