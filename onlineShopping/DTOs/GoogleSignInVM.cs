using System.ComponentModel.DataAnnotations;

namespace onlineShopping.DTOs
{
    public class GoogleSignInVM
    {
        [Required]
        public string IdToken { get; set; }
    }
}
