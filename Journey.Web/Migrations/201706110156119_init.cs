namespace Journey.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Trips",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        DateTime = c.DateTime(nullable: false),
                        StartMilage = c.Int(nullable: false),
                        ArrivalMilage = c.Int(nullable: false),
                        StartAddress = c.String(),
                        ArrivalAddress = c.String(),
                        Errand = c.String(),
                        Notes = c.String(),
                        Vehicle_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Vehicles", t => t.Vehicle_Id)
                .Index(t => t.Vehicle_Id);
            
            CreateTable(
                "dbo.Vehicles",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        RegistrationNumber = c.String(),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Trips", "Vehicle_Id", "dbo.Vehicles");
            DropIndex("dbo.Trips", new[] { "Vehicle_Id" });
            DropTable("dbo.Vehicles");
            DropTable("dbo.Trips");
        }
    }
}
