using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace onlineShopping.Migrations
{
    /// <inheritdoc />
    public partial class upProductItemOrdered : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ItemOrderd_Name",
                table: "OrderItem",
                newName: "ItemOrderd_NameEn");

            migrationBuilder.AddColumn<string>(
                name: "ItemOrderd_NameAr",
                table: "OrderItem",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemOrderd_NameAr",
                table: "OrderItem");

            migrationBuilder.RenameColumn(
                name: "ItemOrderd_NameEn",
                table: "OrderItem",
                newName: "ItemOrderd_Name");
        }
    }
}
