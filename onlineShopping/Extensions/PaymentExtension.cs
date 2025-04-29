using Microsoft.Extensions.Localization;
using onlineShopping.Entities;
using Stripe;
using Stripe.V2;
using System.Linq;

namespace onlineShopping.Extensions
{
    public class PaymentExtension
    {
        private readonly IConfiguration _config;

        public PaymentExtension(IConfiguration config)
        {
            _config = config;
        }


        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
            StripeConfiguration.ApiKey = _config["StripeSetting:Secretkey"];

            var service = new PaymentIntentService();

            var intent = new PaymentIntent();

            var subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price);
            var deliveryFee = subtotal > 100 ? 0 : 2;
            decimal amount = subtotal + deliveryFee;


            if (string.IsNullOrEmpty(basket.PaymentIntendId))
            {

                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)amount * 1000,
                    Currency = "OMR",
                    PaymentMethodTypes = new List<string>
                    {
                        "card"
                    }
                };
                intent = await service.CreateAsync(options);

            }

            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)amount * 1000,

                };
                await service.UpdateAsync(basket.PaymentIntendId, options);
            }

            return intent;
        }

    }
}
