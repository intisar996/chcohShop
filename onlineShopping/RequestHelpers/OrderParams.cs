namespace onlineShopping.RequestHelpers
{
    public class OrderParams : PaginationParams
    {
        public string OrderBY { get; set; } = string.Empty;

        public string SearchTerm { get; set; } = string.Empty;


    }
}
