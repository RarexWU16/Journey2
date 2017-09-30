namespace Journey.Web.Migrations
{
    using Domain.Entities;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "Journey.Web.Models.ApplicationDbContext";
        }

        protected override void Seed(ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            //context.Roles.Add(new Microsoft.AspNet.Identity.EntityFramework.IdentityRole {Id = Guid.NewGuid().ToString(), Name = "administrator" });
            //context.Roles.Add(new Microsoft.AspNet.Identity.EntityFramework.IdentityRole { Id = Guid.NewGuid().ToString(), Name = "user" });

            //context.Users.Add(new Models.ApplicationUser { Id = Guid.NewGuid().ToString(), });
            if (!context.Roles.Any(r => r.Name == "administrator"))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var role = new IdentityRole { Name = "administrator" };


                manager.Create(role);
            }
            if (!context.Roles.Any(r => r.Name == "user"))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var role = new IdentityRole { Name = "user" };


                manager.Create(role);
            }
            // if user doesn't exist, create one and add it to the admin role
            if (!context.Users.Any(u => u.UserName == "ester@tester.dev"))
            {
                var store = new UserStore<ApplicationUser>(context);
                var manager = new UserManager<ApplicationUser>(store);
                var user = new ApplicationUser
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = "ester@tester.dev",
                    Email = "ester@tester.dev"
                };

                manager.Create(user, "password");
                manager.AddToRole(user.Id, "administrator");
            }
        }
    }
}
