using Domain;
using Journey.Domain.Entities;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Domain.Entities
{
    public class Vehicle
    {
        public Guid Id { get; set; }
        public string RegistrationNumber { get; set; }
        public bool IsActive { get; set; }
        public bool IsDefault { get; set; }
        public ApplicationUser User { get; set; }
        public string UserId { get; set; }
        //public Vehicle(string registrationNumber, bool isActive, string user)
        //{
        //    this.Id = Guid.NewGuid();
        //    this.RegistrationNumber = registrationNumber;
        //    this.IsActive = isActive;
        //    UserId = user;
        //}
    }
  
}
