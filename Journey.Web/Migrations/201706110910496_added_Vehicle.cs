namespace Journey.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class added_Vehicle : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Vehicles", "ApplicationUser_Id", c => c.String(maxLength: 128));
            CreateIndex("dbo.Vehicles", "ApplicationUser_Id");
            AddForeignKey("dbo.Vehicles", "ApplicationUser_Id", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Vehicles", "ApplicationUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Vehicles", new[] { "ApplicationUser_Id" });
            DropColumn("dbo.Vehicles", "ApplicationUser_Id");
        }
    }
}
