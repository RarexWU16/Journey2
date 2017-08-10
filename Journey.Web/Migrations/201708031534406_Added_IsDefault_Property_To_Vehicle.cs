namespace Journey.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Added_IsDefault_Property_To_Vehicle : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Vehicles", "IsDefault", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Vehicles", "IsDefault");
        }
    }
}
