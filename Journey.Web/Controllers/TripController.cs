using Domain;
using Domain.Entities;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.draw;
using Journey.Domain.Entities;
using Journey.Web.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;

namespace Journey.Web.Controllers
{
    public class QueryObj
    {
        public Guid Id { get; set; }
        public DateTime FirstDate { get; set; }
        public DateTime LastDate { get; set; }
    }

    public class TripController : ApiController
    {

        public ApplicationDbContext db = new ApplicationDbContext();

        ApplicationUser user = HttpContext.Current.GetOwinContext()
           .GetUserManager<ApplicationUserManager>()
           .FindById(HttpContext.Current.User.Identity
           .GetUserId());

        //&& user.Vehicles == user.Vehicles.Find()

        [Authorize]
        [HttpGet]
        [Route("api/trips")]
        public IHttpActionResult GetTrips()
        {
            List<Trip> listOfTrips = db.Trips
                .Where(x => x.Id != null && x.Vehicle.User.Id == user.Id)
                .Include(x => x.Vehicle)
                .ToList();

            return Ok(listOfTrips);
        }

        [Authorize]
        [HttpPost]
        [Route("api/trips/pdfreport")]
        public IHttpActionResult PDFReport(QueryObj queryObj)
        {

            if (queryObj.Id == null)
            {
                return BadRequest();
            }

            //TODO add dateTime query
            List<Trip> listOfTrips = db.Trips
                .Where(x => x.Vehicle.Id == queryObj.Id
                        && x.DateTime >= queryObj.FirstDate
                        && x.DateTime <= queryObj.LastDate).Include(x => x.Vehicle)
                .ToList();


            var currentDate = DateTime.Now;
            var currentVehicle = db.Vehicles.Where(x => x.Id == queryObj.Id).First();



            //New table
            PdfPTable table = new PdfPTable(7);
            table.WidthPercentage = 100;

            table.AddCell("Datum");
            table.AddCell("Mätarställning start");
            table.AddCell("Mätarställning ankomst");
            table.AddCell("Startadress");
            table.AddCell("Ankomstadress");
            table.AddCell("Ärende");
            table.AddCell("Anteckningar");

            if (listOfTrips != null)
            {

                foreach (var item in listOfTrips)
                {
                    table.AddCell(item.DateTime.ToShortDateString());
                    table.AddCell(item.StartMilage.ToString());
                    table.AddCell(item.ArrivalMilage.ToString());
                    table.AddCell(item.StartAddress);
                    table.AddCell(item.ArrivalAddress);
                    table.AddCell(item.Errand);
                    table.AddCell(item.Notes);
                }
            }

            //Test path
            //string filePath = @"F:\Journey\";
            string filePath = AppDomain.CurrentDomain.BaseDirectory + "PDF\\";


            //Generate file name - "Journey_2017-08-07_SAD465.pdf
            string fileName = "Journey_" + currentDate.ToString("yyyyMMddHHmmssfff") + "_" + currentVehicle.RegistrationNumber + ".pdf";



            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            FileStream fs = new FileStream(filePath + fileName, FileMode.Create, FileAccess.Write, FileShare.None);

            Document doc = new Document();

            PdfWriter writer = PdfWriter.GetInstance(doc, fs);

            doc.Open();

            doc.Add(new Paragraph("Journey - " + currentDate.ToShortDateString()));
            doc.Add(new Paragraph("Fordon - " + currentVehicle.RegistrationNumber));

            Chunk linebreak = new Chunk(new LineSeparator(4f, 100f, BaseColor.BLACK, Element.ALIGN_CENTER, -1));

            doc.Add(linebreak);
            doc.Add(table);
            doc.Close();


            return Ok(filePath + fileName);
        }

        [Authorize]
        [HttpGet]
        [Route("api/trips/report")]
        public IHttpActionResult Report(Guid id)
        {

            List<Trip> listOfTrips = db.Trips
                .Where(x => x.Vehicle.Id == id)
                .ToList();

            return Ok(listOfTrips);
        }

        [Authorize]
        [HttpGet]
        [Route("api/trips/ongoing/{id}")]
        public IHttpActionResult OnGoing(Guid id)
        {

            Trip trip = db.Trips.Where(x => x.Id == id).Include(x => x.Vehicle).First();

            return Ok(trip);
        }

        [Authorize]
        [HttpGet]
        [Route("api/trips/ongoing")]
        public IHttpActionResult OnGoing()
        {
            //TODO FELHANTERA
            try
            {
                Trip onGoingTrip = db.Trips
                .Where(x => x.ArrivalMilage <= x.StartMilage)
                .Include(x => x.Vehicle)
                .OrderByDescending(x => x.DateTime)
                .First();

                return Ok(onGoingTrip);
            }
            catch (Exception)
            {
                return Ok("No Trip");
            }
        }


        [Authorize]
        [HttpGet]
        [Route("api/trips/last")]
        public IHttpActionResult GetLast()
        {
            try
            {
                Trip lastTrip = db.Trips
               .Include(x => x.Vehicle).Where(x => x.Vehicle.User.Id == user.Id)
               .OrderByDescending(x => x.DateTime)
               .First();

                return Ok(lastTrip);
            }
            catch (Exception ex)
            {
                return Ok("No Trip");
                throw ex;
            }
           //TODO felhantera if null
            
        }
        [Authorize]
        [HttpPost]
        [Route("api/trips/register")]
        public IHttpActionResult Register(Trip trip)
        {
            //Register new trip
            if (trip.Id == Guid.Empty)
            {
                if (trip.Vehicle.Id == null)
                {
                    return BadRequest();
                }
                Vehicle designatedVehicle = db.Vehicles.Find(trip.Vehicle.Id);
                trip.Vehicle = designatedVehicle;

                Trip newTrip = new Trip(trip.DateTime,
                                    trip.StartMilage,
                                    trip.ArrivalMilage,
                                    trip.StartAddress,
                                    trip.ArrivalAddress,
                                    trip.Errand,
                                    trip.Notes,
                                    trip.Vehicle);

                db.Trips.Add(newTrip);
                db.SaveChanges();

                return Ok("success");

            }
            //Edit old trip
            else
            {
                try
                {
                    Trip existingTrip = db.Trips.Find(trip.Id);

                    existingTrip.ArrivalMilage = trip.ArrivalMilage;
                    existingTrip.Notes = trip.Notes;

                    db.Entry(existingTrip).State = EntityState.Modified;
                    db.SaveChanges();
                    //TODO FELHANTERA
                    return Ok("success");
                }
                catch (Exception ex)
                {

                    throw ex;
                }
                
            }
         
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}
