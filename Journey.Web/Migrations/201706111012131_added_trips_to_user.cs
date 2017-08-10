namespace Journey.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class added_trips_to_user : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Trips", "ApplicationUser_Id", c => c.String(maxLength: 128));
            CreateIndex("dbo.Trips", "ApplicationUser_Id");
            AddForeignKey("dbo.Trips", "ApplicationUser_Id", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Trips", "ApplicationUser_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Trips", new[] { "ApplicationUser_Id" });
            DropColumn("dbo.Trips", "ApplicationUser_Id");
        }
    }
}
