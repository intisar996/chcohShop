using System.ComponentModel.DataAnnotations;

namespace onlineShopping.Entities
{
    public class Product : BaseModel
    {
      
        [Required]
        [StringLength(50)]
        public string  NameEn { get; set; }
        [Required]
        [StringLength(50)]
        public string  NameAr { get; set; } 
        [Required]
        [MaxLength(500)]
        public string DescriptionEn { get; set; } 
        [Required]
        [MaxLength(500)]
        public string DescriptionAr { get; set; } 
        [Required]
        [Range(0, double.PositiveInfinity)]
        public decimal Price { get; set; }
        [Required]
        public string PicterUrl { get; set; } 
        [Required]
        public ChchoType  Type { get; set; }
        [Required]
        [StringLength(100)]
        public string  Brand {  get; set; } 
        [Required]
        [Range(0, 200)]
        public int QuantityStock { get; set; }
        [Required]
        [StringLength(25)]
        public string Size {  get; set; } 
        [Required]
        [StringLength(25)]
        public string Sugar { get; set; } 
        [Required]
        [StringLength(25)]
        public string Fat { get; set; } 
        public string? PublicId { get; set; }





        public enum ChchoType
        {
            White = 1,
            Dark = 2,
            Milk = 3,
            Truffle = 4,
        }

    }
}
