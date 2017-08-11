using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Journey.Web.Models.Data
{
    public class DateForm
    {
        public Guid Id { get; set; }
        public DateTime FirstDate { get; set; }
        public DateTime LastDate { get; set; }
    }
}