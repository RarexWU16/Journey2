using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Domain;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Domain.Entities;

namespace Journey.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }


    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Trip> Trips { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }
        static ApplicationDbContext()
        {

            // Handle all mods manually.
            //Database.SetInitializer<ApplicationDbContext>(new ApplicationDbInitializer());
        }
        //protected override void OnModelCreating(DbModelBuilder modelBuilder)
        //{
        //    // Add Identity related model configuration
        //    base.OnModelCreating(modelBuilder);
        //    // Your fluent modeling here
        //    modelBuilder.Entity<Trip>()
        //    .HasMany(x => x.Vehicle)
        //    .WithOptional()
        //    .WillCascadeOnDelete(true);
        //}

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
        
    }
}