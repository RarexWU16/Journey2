using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;


[assembly: OwinStartupAttribute(typeof(Journey.Web.Startup))]
[assembly: log4net.Config.XmlConfigurator(ConfigFile = "Web.config", Watch = true)]
namespace Journey.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {

            app.MapSignalR();
            ConfigureAuth(app);
        }
    }
}
