using Journey.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Trip
    {
        public Guid Id { get; set; }
        public Vehicle Vehicle { get; set; }
        public DateTime DateTime { get; set; }
        public int StartMilage { get; set; }
        public int ArrivalMilage { get; set; }
        public string StartAddress { get; set; }
        public string ArrivalAddress { get; set; }
        public string Errand { get; set; }
        public string Notes { get; set; }

        public Trip(DateTime DateTime, int startMilage, int arrivalMilage, string startAdress, string arrivalAddress, string errand, string notes, Vehicle vehicle)
        {

            this.Id = Guid.NewGuid();

            this.DateTime = DateTime;
            this.StartMilage = startMilage;
            this.ArrivalMilage = 0;
            this.StartAddress = startAdress;
            this.ArrivalAddress = arrivalAddress;
            this.Errand = errand;
            this.Notes = notes;
            this.Vehicle = vehicle;

        }
        public Trip()
        {
               
        }
    }
}
