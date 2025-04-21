using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStore.Migrations
{
    /// <inheritdoc />
    public partial class AddBookOrderJoinTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
 migrationBuilder.CreateTable(
        name: "BookOrder",
        columns: table => new
        {
            BooksId = table.Column<int>(type: "int", nullable: false),
            OrdersId = table.Column<int>(type: "int", nullable: false)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_BookOrder", x => new { x.BooksId, x.OrdersId });
            table.ForeignKey(
                name: "FK_BookOrder_Books_BooksId",
                column: x => x.BooksId,
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            table.ForeignKey(
                name: "FK_BookOrder_Orders_OrdersId",
                column: x => x.OrdersId,
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
