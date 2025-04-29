using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace onlineShopping.Entities
{
    public class Address
    {
        [JsonIgnore]
        public int Id { get; set; }

        [StringLength(100)]
        public required string FullName { get; set; }
        [StringLength(50)]
        public required string Address1 { get; set; }
        public string Address2 { get; set; }

        [StringLength(50)]
        public required string City { get; set; }
        [StringLength(50)]
        public required string State { get; set; }

        [JsonPropertyName("postal_code")]
        public required string PostalCode { get; set; }

        [StringLength(50)]
        public required string Country { get; set; }



    }
}
