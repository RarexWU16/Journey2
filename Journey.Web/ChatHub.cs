using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Journey.Domain.Entities;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace Journey.Web
{


    public class ChatHub : Hub
    {
        public static List<string> AllRooms { get; set; } = new List<string>();
        public void SendMessage(string name, string message, string roomName)
        {
            if (roomName.Trim() == "")
            {
                roomName = Guid.NewGuid().ToString();
            }

            Clients.Group(roomName.Trim()).broadcastMessage(name, message);
        }

        public void CreateRoom(string roomName)
        {
            if (!AllRooms.Contains(roomName))
            {
                AllRooms.Add(roomName);
            }         
            Groups.Add(Context.ConnectionId, roomName);
        }
        
 
        public void GetAllRooms()
        {
            //only admins are allowed to see all surrent chatrooms
            if (Context.User.IsInRole("administrator"))
            {
                Clients.All.broadcastRooms(AllRooms);
            }
           
        }

        public void RemoveRoom(string currentRoom)
        {
            AllRooms.Remove(currentRoom);
            Groups.Remove(Context.ConnectionId, currentRoom);
            Clients.All.broadcastRooms(AllRooms);
        }

    }

}