using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BookStore.Migrations
{
    /// <inheritdoc />
    public partial class AddDiscountAmountToOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Bookmark_BookmarkId",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Books_BookId",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Users_UserId",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderBooks_Books_BookId",
                table: "OrderBooks");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderBooks_Orders_OrderId",
                table: "OrderBooks");

            migrationBuilder.DropTable(
                name: "Bookmark");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CartItems",
                table: "CartItems");

            migrationBuilder.DropIndex(
                name: "IX_CartItems_BookmarkId",
                table: "CartItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderBooks",
                table: "OrderBooks");

            migrationBuilder.DropColumn(
                name: "BookmarkId",
                table: "CartItems");

            migrationBuilder.RenameTable(
                name: "CartItems",
                newName: "cartitems");

            migrationBuilder.RenameTable(
                name: "OrderBooks",
                newName: "OrderBook");

            migrationBuilder.RenameIndex(
                name: "IX_CartItems_UserId",
                table: "cartitems",
                newName: "IX_cartitems_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_CartItems_BookId",
                table: "cartitems",
                newName: "IX_cartitems_BookId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderBooks_OrderId",
                table: "OrderBook",
                newName: "IX_OrderBook_OrderId");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountAmount",
                table: "Orders",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Books",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Books",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "InStock",
                table: "Books",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPhysicalAccessAvailable",
                table: "Books",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "OrderBook",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_cartitems",
                table: "cartitems",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderBook",
                table: "OrderBook",
                columns: new[] { "BookId", "OrderId" });

            migrationBuilder.CreateTable(
                name: "BookOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OrderId = table.Column<int>(type: "integer", nullable: false),
                    BookId = table.Column<int>(type: "integer", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookOrders_Books_BookId",
                        column: x => x.BookId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookOrders_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "wishlist_items",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    book_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wishlist_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_wishlist_items_Books_book_id",
                        column: x => x.book_id,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_wishlist_items_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookOrders_BookId",
                table: "BookOrders",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_BookOrders_OrderId",
                table: "BookOrders",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_wishlist_items_book_id",
                table: "wishlist_items",
                column: "book_id");

            migrationBuilder.CreateIndex(
                name: "IX_wishlist_items_user_id",
                table: "wishlist_items",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_cartitems_Books_BookId",
                table: "cartitems",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_cartitems_Users_UserId",
                table: "cartitems",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderBook_Books_BookId",
                table: "OrderBook",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderBook_Orders_OrderId",
                table: "OrderBook",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_cartitems_Books_BookId",
                table: "cartitems");

            migrationBuilder.DropForeignKey(
                name: "FK_cartitems_Users_UserId",
                table: "cartitems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderBook_Books_BookId",
                table: "OrderBook");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderBook_Orders_OrderId",
                table: "OrderBook");

            migrationBuilder.DropTable(
                name: "BookOrders");

            migrationBuilder.DropTable(
                name: "wishlist_items");

            migrationBuilder.DropPrimaryKey(
                name: "PK_cartitems",
                table: "cartitems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderBook",
                table: "OrderBook");

            migrationBuilder.DropColumn(
                name: "DiscountAmount",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "InStock",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "IsPhysicalAccessAvailable",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "OrderBook");

            migrationBuilder.RenameTable(
                name: "cartitems",
                newName: "CartItems");

            migrationBuilder.RenameTable(
                name: "OrderBook",
                newName: "OrderBooks");

            migrationBuilder.RenameIndex(
                name: "IX_cartitems_UserId",
                table: "CartItems",
                newName: "IX_CartItems_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_cartitems_BookId",
                table: "CartItems",
                newName: "IX_CartItems_BookId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderBook_OrderId",
                table: "OrderBooks",
                newName: "IX_OrderBooks_OrderId");

            migrationBuilder.AddColumn<int>(
                name: "BookmarkId",
                table: "CartItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Books",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CartItems",
                table: "CartItems",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderBooks",
                table: "OrderBooks",
                columns: new[] { "BookId", "OrderId" });

            migrationBuilder.CreateTable(
                name: "Bookmark",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Bookmarks = table.Column<int[]>(type: "integer[]", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MembershipId = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    URL = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookmark", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookmark_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_BookmarkId",
                table: "CartItems",
                column: "BookmarkId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookmark_UserId",
                table: "Bookmark",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Bookmark_BookmarkId",
                table: "CartItems",
                column: "BookmarkId",
                principalTable: "Bookmark",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Books_BookId",
                table: "CartItems",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Users_UserId",
                table: "CartItems",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderBooks_Books_BookId",
                table: "OrderBooks",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderBooks_Orders_OrderId",
                table: "OrderBooks",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
