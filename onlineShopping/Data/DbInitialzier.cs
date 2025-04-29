using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using onlineShopping.Entities;
using System.Drawing.Text;
using static onlineShopping.Entities.Product;

namespace onlineShopping.Data
{
    public class DbInitialzier
    {

        public static async Task InitDb(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Initializing database...");


            var context = scope.ServiceProvider.GetRequiredService<StoreContext>()
               ?? throw new InvalidOperationException("Failed to retrieve store context");

            var userManger = scope.ServiceProvider.GetRequiredService<UserManager<User>>()
                ?? throw new InvalidOperationException("Failed to retrieve user manager");

            await SeedData(context, userManger);
        }


        private static async Task SeedData(StoreContext context,UserManager<User> userManager)
        {
            context.Database.Migrate();

            if(!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "entisar",
                    Email = "intisar19961@hotmial.com"
                };

                await userManager.CreateAsync(user, "123456Aa@");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new User
                {
                    UserName = "admin",
                    Email = "admin@hotmial.com"
                };


                await userManager.CreateAsync(admin, "Pa$$0rd");

                await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });
            }

            if (context.Products.Any()) return;

            var products = new List<Product>
            {
               new()
                {
                    NameEn = "GALAXY Minstrels Large Pouch",
                    NameAr = "كيس كبير من شوكولاتة GALAXY Minstrels",

                    DescriptionEn =
                        "Deliciously creamy Galaxy chocolate wrapped in a crunchy, delicate shell.",

                    DescriptionAr =
                        "شوكولاتة Galaxy الكريمية اللذيذة مغلّفة بقشرة مقرمشة ورقيقة",
                    Price = 3,
                    PicterUrl = "/images/products/cho1.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Milk,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                new()
                {
                    NameEn = "GALAXY Minstrels Pouch",
                    NameAr = "كيس شوكولاتة GALAXY Minstrels",

                    DescriptionEn =
                        "Smooth and creamy Galaxy chocolate captured in a crispy shell.",

                    DescriptionAr =
                        "شوكولاتة Galaxy الناعمة والكريمية محاطة بقشرة مقرمشة",
                    Price = 2,
                    PicterUrl = "/images/products/cho2.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Dark,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
               new()
                {
                    NameEn = "GALAXY Counters Pouch",
                    NameAr = "كيس GALAXY Counters",

                    DescriptionEn =
                        "Pieces of smooth and creamy Galaxy chocolate, lovingly created to melt in your mouth.",

                    DescriptionAr =
                        "قطع من شوكولاتة Galaxy الناعمة والكريمية، تم صنعها بحب لتذوب في فمك",
                    Price = 1500,
                    PicterUrl = "/images/products/cho3.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Truffle,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                  new()
                {
                    NameEn = "GALAXY Minstrels",
                    NameAr = "كيس GALAXY Minstrels",

                    DescriptionEn =
                        "Treat yourself to a bag of Minstrels®, with silky smooth Galaxy® Milk Chocolate encased in a crispy shell.",

                    DescriptionAr =
                        "دلل نفسك بكيس من Minstrels، مع شوكولاتة Galaxy® بالحليب الناعمة والسلسة مغلفة بقشرة مقرمشة",
                    Price = 0500,
                    PicterUrl = "/images/products/cho4.png",
                    Brand = "Galaxy",
                    Type = ChchoType.White,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                 new()
                {
                    NameEn = "GALAXY Minstrels 2 ss",
                    NameAr = "كيس GALAXY Minstrels",

                    DescriptionEn =
                        "Treat yourself to a bag of Minstrels®, with silky smooth Galaxy® Milk Chocolate encased in a crispy shell.",

                    DescriptionAr =
                        "دلل نفسك بكيس من Minstrels، مع شوكولاتة Galaxy® بالحليب الناعمة والسلسة مغلفة بقشرة مقرمشة",
                    Price = 0500,
                    PicterUrl = "/images/products/cho4.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Truffle,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                new()
                {
                    NameEn = "GALAXY Minstrels 6 ",
                    NameAr = "كيس GALAXY Minstrels",

                    DescriptionEn =
                        "Treat yourself to a bag of Minstrels®, with silky smooth Galaxy® Milk Chocolate encased in a crispy shell.",

                    DescriptionAr =
                        "دلل نفسك بكيس من Minstrels، مع شوكولاتة Galaxy® بالحليب الناعمة والسلسة مغلفة بقشرة مقرمشة",
                    Price = 0500,
                    PicterUrl = "/images/products/cho4.png",
                    Brand = "Galaxy",
                    Type = ChchoType.White,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
               new()
                {
                    NameEn = "GALAXY Minstrels Large Pouch",
                    NameAr = "كيس كبير من شوكولاتة GALAXY Minstrels",

                    DescriptionEn =
                        "Deliciously creamy Galaxy chocolate wrapped in a crunchy, delicate shell.",

                    DescriptionAr =
                        "شوكولاتة Galaxy الكريمية اللذيذة مغلّفة بقشرة مقرمشة ورقيقة",
                    Price = 3,
                    PicterUrl = "/images/products/cho1.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Milk,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                new()
                {
                    NameEn = "GALAXY Minstrels Pouch",
                    NameAr = "كيس شوكولاتة GALAXY Minstrels",

                    DescriptionEn =
                        "Smooth and creamy Galaxy chocolate captured in a crispy shell.",

                    DescriptionAr =
                        "شوكولاتة Galaxy الناعمة والكريمية محاطة بقشرة مقرمشة",
                    Price = 2,
                    PicterUrl = "/images/products/cho2.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Dark,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                new()
                {
                    NameEn = "GALAXY Counters Pouch",
                    NameAr = "كيس GALAXY Counters",

                    DescriptionEn =
                        "Pieces of smooth and creamy Galaxy chocolate, lovingly created to melt in your mouth.",

                    DescriptionAr =
                        "قطع من شوكولاتة Galaxy الناعمة والكريمية، تم صنعها بحب لتذوب في فمك",
                    Price = 1500,
                    PicterUrl = "/images/products/cho3.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Truffle,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                new()
                {
                    NameEn = "GALAXY Minstrels Large Pouch",
                    NameAr = "كيس كبير من شوكولاتة GALAXY Minstrels",

                    DescriptionEn =
                        "Deliciously creamy Galaxy chocolate wrapped in a crunchy, delicate shell.",

                    DescriptionAr =
                        "شوكولاتة Galaxy الكريمية اللذيذة مغلّفة بقشرة مقرمشة ورقيقة",
                    Price = 3,
                    PicterUrl = "/images/products/cho1.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Milk,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                new()
                {
                    NameEn = "GALAXY Minstrels Pouch",
                    NameAr = "كيس شوكولاتة GALAXY Minstrels",

                    DescriptionEn =
                        "Smooth and creamy Galaxy chocolate captured in a crispy shell.",

                    DescriptionAr =
                        "شوكولاتة Galaxy الناعمة والكريمية محاطة بقشرة مقرمشة",
                    Price = 2,
                    PicterUrl = "/images/products/cho2.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Dark,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                 new()
                {
                    NameEn = "GALAXY Counters Pouch",
                    NameAr = "كيس GALAXY Counters",

                    DescriptionEn =
                        "Pieces of smooth and creamy Galaxy chocolate, lovingly created to melt in your mouth.",

                    DescriptionAr =
                        "قطع من شوكولاتة Galaxy الناعمة والكريمية، تم صنعها بحب لتذوب في فمك",
                    Price = 1500,
                    PicterUrl = "/images/products/cho3.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Truffle,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                 new()
                {
                    NameEn = "GALAXY Minstrels Large Pouch",
                    NameAr = "كيس كبير من شوكولاتة GALAXY Minstrels",

                    DescriptionEn =
                        "Deliciously creamy Galaxy chocolate wrapped in a crunchy, delicate shell.",

                    DescriptionAr =
                        "شوكولاتة Galaxy الكريمية اللذيذة مغلّفة بقشرة مقرمشة ورقيقة",
                    Price = 3,
                    PicterUrl = "/images/products/cho1.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Milk,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                new()
                {
                    NameEn = "GALAXY Minstrels Pouch",
                    NameAr = "كيس شوكولاتة GALAXY Minstrels",

                    DescriptionEn =
                        "Smooth and creamy Galaxy chocolate captured in a crispy shell.",

                    DescriptionAr =
                        "شوكولاتة Galaxy الناعمة والكريمية محاطة بقشرة مقرمشة",
                    Price = 2,
                    PicterUrl = "/images/products/cho2.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Dark,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                new()
                {
                    NameEn = "GALAXY Counters Pouch m",
                    NameAr = "كيس GALAXY Counters",

                    DescriptionEn =
                        "Pieces of smooth and creamy Galaxy chocolate, lovingly created to melt in your mouth.",

                    DescriptionAr =
                        "قطع من شوكولاتة Galaxy الناعمة والكريمية، تم صنعها بحب لتذوب في فمك",
                    Price = 1500,
                    PicterUrl = "/images/products/cho9.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Truffle,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                new()
                {
                    NameEn = "GALAXY Minstrels Large Pouch b",
                    NameAr = "كيس كبير من شوكولاتة GALAXY Minstrels",

                    DescriptionEn =
                        "Deliciously creamy Galaxy chocolate wrapped in a crunchy, delicate shell.",

                    DescriptionAr =
                        "شوكولاتة Galaxy الكريمية اللذيذة مغلّفة بقشرة مقرمشة ورقيقة",
                    Price = 3,
                    PicterUrl = "/images/products/cho8.png",
                    Brand = "LINDOR",
                    Type = ChchoType.Milk,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
               new()
                {
                    NameEn = "GALAXY Minstrels Pouch s",
                    NameAr = "كيس شوكولاتة GALAXY Minstrels",

                    DescriptionEn =
                        "Smooth and creamy Galaxy chocolate captured in a crispy shell.",

                    DescriptionAr =
                        "شوكولاتة Galaxy الناعمة والكريمية محاطة بقشرة مقرمشة",
                    Price = 2,
                    PicterUrl = "/images/products/cho7.png",
                    Brand = "LINDOR",
                    Type = ChchoType.Dark,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)",
                },
                new()
                {
                    NameEn = "GALAXY Counters Pouch x",
                    NameAr = "كيس GALAXY Counters",

                    DescriptionEn =
                        "Pieces of smooth and creamy Galaxy chocolate, lovingly created to melt in your mouth.",

                    DescriptionAr =
                        "قطع من شوكولاتة Galaxy الناعمة والكريمية، تم صنعها بحب لتذوب في فمك",
                    Price = 1500,
                    PicterUrl = "/images/products/cho6.png",
                    Brand = "Galaxy",
                    Type = ChchoType.Dark,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                new()
                {
                    NameEn = "GALAXY Counters Pouch oo",
                    NameAr = "كيس GALAXY Counters",

                    DescriptionEn =
                        "Pieces of smooth and creamy Galaxy chocolate, lovingly created to melt in your mouth.",

                    DescriptionAr =
                        "قطع من شوكولاتة Galaxy الناعمة والكريمية، تم صنعها بحب لتذوب في فمك",
                    Price = 1500,
                    PicterUrl = "/images/products/cho11.png",
                    Brand = "LINDOR",
                    Type = ChchoType.Milk,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                },
                 new()
                {
                    NameEn = "GALAXY Counters Pouch rrr",
                    NameAr = "كيس GALAXY Counters",

                    DescriptionEn =
                        "Pieces of smooth and creamy Galaxy chocolate, lovingly created to melt in your mouth.",

                    DescriptionAr =
                        "قطع من شوكولاتة Galaxy الناعمة والكريمية، تم صنعها بحب لتذوب في فمك",
                    Price = 1500,
                    PicterUrl = "/images/products/cho12.png",
                    Brand = "LINDOR",
                    Type = ChchoType.Dark,
                    QuantityStock = 100,
                    Size = "240g",
                    Fat ="11g (16%)",
                    Sugar = "32g (36%)"
                }


            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }













    }
}

