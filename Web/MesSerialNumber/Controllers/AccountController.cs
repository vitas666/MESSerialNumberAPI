using System;
using System.Web.Mvc;
using WebTemplate.ActionFilter;
using MesSerialNumber.Constant;

namespace MesSerialNumber.Controllers
{
    public class AccountController : BaseController
    {
        [WebTemplateActionFilter(AuthorizeRequired = false, CallByAjax = false)]
        public ActionResult Login()
        {
            ActionResult actionResult = this.DefaultLogin();

            return actionResult;
        }

        [WebTemplateActionFilter(AuthorizeRequired = false, CallByAjax = true)]
        [HttpPost]
        public ActionResult Auth(string domain, string account, string password, bool rememberMe)
        {
            ActionResult actionResult = null;
            Session[Common.ACCOUNT] = account.ToUpper();
            try
            {
                actionResult = this.DefaultAuth(domain, account, password, rememberMe);
            }
            catch (Exception e)
            {
                throw e;
            }

            return actionResult;
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = false, AllowExecuteForAnyAuthorizedUser = true)]
        public ActionResult Main()
        {
            return View();
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = false)]
        public ActionResult Logoff()
        {
            ActionResult actionResult = this.DefaultLogoff();
            return actionResult;
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = false)]
        public ActionResult ChangePassword()
        {
            return View();
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public ActionResult GridEditRetrieve()
        {
            ActionResult actionResult = this.DefaultGridEditRetrieve();

            return actionResult;
        }
    }
}