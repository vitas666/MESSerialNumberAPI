using System.Web.Mvc;
using WebTemplate.Controllers;

namespace MesSerialNumber.Controllers
{
    public class BaseController : CommonController
    {
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            this.ActionValidation(filterContext);
        }

    }
}