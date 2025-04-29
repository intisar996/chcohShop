using Microsoft.AspNetCore.Http.Features;

namespace onlineShopping.Entities
{
    public class Basket
    {
        public int Id { get; set; }

        public string ByuerId { get; set; } = string.Empty;

        public List<BasketItem> Items { get; set; } = new();
        public string PaymentIntendId { get; set; }
        public string ClientSecret { get; set; }

        public void AddItem(Product product, int quantity)
        {


            if(Items.All(item => item.ProductId != product.Id ))
            {
                BasketItem basketItem = new BasketItem();
                basketItem.Product = product;
                basketItem.Quantity = quantity;


                Items.Add(basketItem);  

                // Items.Add(new BasketItem { Product = product, Quantity = quantity });
            }

            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);

            if (existingItem != null) existingItem.Quantity += quantity;
        }


        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);

            if(item == null) return;

              if(quantity > 0) item.Quantity -= quantity;

             if(item.Quantity == 0 ) Items.Remove(item);
        }


    }
}
