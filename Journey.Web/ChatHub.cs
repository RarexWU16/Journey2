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
    public class ChatUser
    {
        public string UserName { get; set; }
        public string ConnectionId { get; set; }
    }


    //only user who created chat can join or admin

    public class ChatHub : Hub
    {
        public static Dictionary<ChatUser, string> AllRooms { get; set; } = new Dictionary<ChatUser, string>();
        public void SendMessage(string name, string message, string roomName)
        {
            if (roomName.Trim() == "")
            {
                roomName = Guid.NewGuid().ToString();
            }

            var currentRoom = AllRooms.Where(x => x.Key.ConnectionId == Context.ConnectionId).FirstOrDefault();

            if (currentRoom.Value == roomName || Context.User.IsInRole("administrator"))
            {
                Clients.Group(roomName.Trim()).broadcastMessage(name, message);
            }
        }

        public void CreateRoom(string roomName, string name)
        {
            var chatUser = new ChatUser
            {
                UserName = name,
                ConnectionId = Context.ConnectionId
            };

            if (!AllRooms.ContainsValue(roomName))
            {
                AllRooms.Add(chatUser, roomName);
            }
            
            Groups.Add(Context.ConnectionId, roomName);
        }
        
 
        public void GetAllRooms()
        {
            //only admins are allowed to see all current chatrooms
            if (Context.User.IsInRole("administrator"))
            {
                Clients.User(Context.User.Identity.Name).broadcastRooms(AllRooms.Values.ToList());
            }          
        }

        public void RemoveRoom(string currentRoom)
        {


            var listOfUserRooms = AllRooms.Keys.Where(x => x.ConnectionId == Context.ConnectionId).ToList();

            foreach (var item in listOfUserRooms)
            {
                AllRooms.Remove(item);
            }
            
            Groups.Remove(Context.ConnectionId, currentRoom);
            Clients.All.broadcastRooms(AllRooms);
        }

    }

}