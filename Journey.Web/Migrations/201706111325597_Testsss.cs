namespace Journey.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Testsss : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Vehicles", name: "User_Id", newName: "ApplicationUser_Id");
            RenameIndex(table: "dbo.Vehicles", name: "IX_User_Id", newName: "IX_ApplicationUser_Id");
            DropColumn("dbo.AspNetUsers", "Klutt");
        }
        
        public override void Down()
        {
            AddColumn("dbo.AspNetUsers", "Klutt", c => c.String());
            RenameIndex(table: "dbo.Vehicles", name: "IX_ApplicationUser_Id", newName: "IX_User_Id");
            RenameColumn(table: "dbo.Vehicles", name: "ApplicationUser_Id", newName: "User_Id");
        }
    }
}
