namespace Journey.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class edited_Vehicle : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Vehicles", new[] { "ApplicationUser_Id" });
            DropColumn("dbo.Vehicles", "UserId");
            RenameColumn(table: "dbo.Vehicles", name: "ApplicationUser_Id", newName: "UserId");
            AlterColumn("dbo.Vehicles", "UserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Vehicles", "UserId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Vehicles", new[] { "UserId" });
            AlterColumn("dbo.Vehicles", "UserId", c => c.String());
            RenameColumn(table: "dbo.Vehicles", name: "UserId", newName: "ApplicationUser_Id");
            AddColumn("dbo.Vehicles", "UserId", c => c.String());
            CreateIndex("dbo.Vehicles", "ApplicationUser_Id");
        }
    }
}
