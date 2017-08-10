namespace Journey.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class vehicles_fix : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Vehicles", "UserId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Vehicles", "UserId");
        }
    }
}
