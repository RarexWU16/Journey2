using Domain.Entities;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using Microsoft.AspNet.Identity.Owin;
using Domain;
using Journey.Web.Models;
using Journey.Domain.Entities;
using Newtonsoft.Json;
using log4net;

namespace Journey.Web.Controllers
{
    [Authorize]
    public class VehiclesController : ApiController
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        private static readonly ILog Log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        [Route("api/vehicles")]
        public IHttpActionResult GetVehicles()
        {
            Log.Debug("GET Request traced");

            ApplicationUser user = HttpContext.Current.GetOwinContext()
           .GetUserManager<ApplicationUserManager>()
           .FindById(HttpContext.Current.User.Identity
           .GetUserId());

            List<Vehicle> listOfVehicles = db.Vehicles
            .Where(x => x.Id != null && x.User.Id == user.Id)
            .ToList();

            var formatted = JsonConvert.SerializeObject(listOfVehicles);

            return Ok(listOfVehicles);

        }

        [Authorize]
        [HttpPost]
        [Route("api/vehicles/register")]
        public IHttpActionResult Register(Vehicle vehicle)
        {

            if (vehicle.Id == Guid.Empty)
            {
                Vehicle newVehicle = new Vehicle
                {
                    Id = Guid.NewGuid(),
                    RegistrationNumber = vehicle.RegistrationNumber.ToUpper(),
                    IsActive = true,
                    UserId = User.Identity.GetUserId(),
                    IsDefault = false
                };

                try
                {
                    db.Vehicles.Add(newVehicle);
                    db.SaveChanges();
                }
                catch (Exception ex)
                {
                    //TODO FELHANTERA
                    Log.Error(ex);
                    throw ex;
                }


                return Ok("success");
            }
            if (vehicle.Id != null)
            {
                try
                {
                    Vehicle selectedVehicle = db.Vehicles.Find(vehicle.Id);

                    //if (User.IsInRole("administrator"))
                    //{

                        //If none are changed
                        if (vehicle.IsActive == selectedVehicle.IsActive && vehicle.IsDefault == selectedVehicle.IsDefault)
                        {
                            return Ok("success");
                        }
                        else
                        {
                            //If IsActive is changed
                            if (selectedVehicle.IsActive != vehicle.IsActive)
                            {
                                selectedVehicle.IsActive = vehicle.IsActive;
                            }
                            //If IsDefault is changed
                            if (selectedVehicle.IsDefault != vehicle.IsDefault)
                            {
                                //ändra så att alla fordon inte är default
                                List<Vehicle> allVehicles = db.Vehicles.Where(x => x.IsDefault == true).ToList();
                                allVehicles.Select(x => { x.IsDefault = false; return x; }).ToList();

                                selectedVehicle.IsDefault = vehicle.IsDefault;
                            }

                            db.Entry(selectedVehicle).State = EntityState.Modified;
                            db.SaveChanges();

                            return Ok("success");
                        }
                    //}

                    //if (User.IsInRole("user"))
                    //{
                    //    if (vehicle.IsActive == selectedVehicle.IsActive)
                    //    {
                    //        selectedVehicle.IsActive = vehicle.IsActive;

                    //        return Ok("success");
                    //    }
                    //    else
                    //    {
                    //        selectedVehicle.IsActive = vehicle.IsActive;

                    //        db.Entry(selectedVehicle).State = EntityState.Modified;
                    //        db.SaveChanges();

                    //        return Ok("success");
                    //    }
                    //}
                    //TODO FELHANTERA
                    return BadRequest();
                }
                catch (Exception ex)
                {
                    Log.Error(ex);
                    throw ex;
                }


            }
            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("api/vehicles/details/{id}")]
        public IHttpActionResult Details(Guid? id)
        {
            Vehicle selectedVehicle = db.Vehicles.Find(id);

            if (selectedVehicle == null)
            {
                return BadRequest(); //TODO FELHANTERA "User tried to see details of non-existing vehicle."
            }

            return Ok(selectedVehicle);

        }
        [Authorize]
        [HttpGet]
        [Route("api/vehicles/delete/{id}")]
        public IHttpActionResult Delete(Guid id)
        {
            try
            {

                var vehicleToRemove = db.Vehicles.SingleOrDefault(x => x.Id == id);

                var tripsToRemove = db.Trips.Where(x => x.Vehicle.Id == vehicleToRemove.Id).ToList();


                db.Trips.RemoveRange(tripsToRemove);

                db.Vehicles.Remove(vehicleToRemove);
                db.SaveChanges();

                return Ok("success");

            }
            catch (Exception ex)
            {
                Log.Error(ex);
                throw ex;
            }
        }

        //[Authorize]
        //[HttpGet]
        //[Route("api/vehicles/edit/{id}")]
        //public IHttpActionResult Edit(Vehicle selectedVehicle)
        //{
        //    Vehicle vehicle = db.Vehicles.Find(selectedVehicle.Id);

        //    if (vehicle == null)
        //    {
        //        return BadRequest(); //TODO FELHANTERA "User tried to edit non-existing vehicle."
        //    }

        //    //TODO skilj på vad användare och admin kan ändra
        //    if (User.IsInRole("administrator"))
        //    {
        //        vehicle.IsActive = selectedVehicle.IsActive;

        //        db.Entry(vehicle).State = EntityState.Modified;
        //        db.SaveChanges();

        //        return Ok("success");
        //    }

        //    if (User.IsInRole("user"))
        //    {
        //        vehicle.IsDefault = selectedVehicle.IsDefault;

        //        db.Entry(vehicle).State = EntityState.Modified;
        //        db.SaveChanges();

        //        return Ok("success");

        //    }
        //    return BadRequest();
        //}


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
