using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using onlineShopping.Entities;
using onlineShopping.Entities.OrderAggregate;

namespace onlineShopping.Data
{
    public class StoreContext : IdentityDbContext<User,Role,int>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {


        }


        public required DbSet<Product> Products { get; set; }
        public required DbSet<Basket> Baskets { get; set; }

        public required DbSet<Order> Orders { get; set; }



        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Role>()
                .HasData(
                    new Role {Id =1, Name = "Member", NormalizedName = "MEMBER" },
                    new Role {Id =2, Name = "Admin", NormalizedName = "ADMIN" }
                );



        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
        }






    }
}
