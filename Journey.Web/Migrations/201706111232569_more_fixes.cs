namespace Journey.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class more_fixes : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "Klutt", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "Klutt");
        }
    }
}
