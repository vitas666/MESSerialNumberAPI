using System.Web.Mvc;
using WebTemplate.ActionFilter;
using MesSerialNumber.Services;
using System.Web;
using MesSerialNumber.Models;
using System.Collections.Generic;

namespace MesSerialNumber.Controllers
{
    public class MaintainController : BaseController
    {
        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = false)]
        public ActionResult PartMast()
        {
            return View();
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = false)]
        public ActionResult PartCoding()
        {
            return View();
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = false)]
        public ActionResult UploadSerial()
        {
            return View();
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = false)]
        public ActionResult SerialAdjustment()
        {
            return View();
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public async System.Threading.Tasks.Task<ActionResult> UploadCsv(HttpPostedFileBase CsvFile)
        {
            SerialDataResult result = new SerialDataResult();
            if (CsvFile != null && CsvFile.ContentLength > 0)
            {
                result = await UploadServices.ProcessCsv(CsvFile.InputStream);
            }
            return Json(result);
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public ActionResult GetPartDesc(string PartNo)
        {
            string result = PartMastServices.GetPartDesc(PartNo);
            return Json(result);
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public ActionResult GetLast(string Value)
        {
            int result = GetLastNo.GetSctlMastNo(Value);
            return Json(result);
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public ActionResult GetLastDesc(string Value)
        {
            string result = GetLastNo.GetSctlMastDesc(Value);
            return Json(result);
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public ActionResult CheckPartNo(string PartNo)
        {
            string result = PartMastServices.CheckPartNo(PartNo);
            return Json(result);
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public ActionResult CheckPartNoRepeat(string PartNo)
        {
            string result = PartMastServices.CheckPartNoRepeat(PartNo);
            return Json(result);
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public ActionResult CheckPartCoding(string CodingRule)
        {
            string result = PartMastServices.CheckPartCoding(CodingRule);
            return Json(result);
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public ActionResult CheckCodingVaild(int PartID)
        {
            List<string> result = PartMastServices.CheckCodingVaild(PartID);
            return Json(result);
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public ActionResult SearchSerialNo(string SerialNo)
        {
            return Json(UpdateSerialServices.SearchSerialNo(SerialNo));
        }

        [WebTemplateActionFilter(AuthorizeRequired = true, CallByAjax = true, AllowExecuteForAnyAuthorizedUser = true)]
        [HttpPost]
        public async System.Threading.Tasks.Task<ActionResult> UpdateSerialNo(string SerialNo, string PartNo, int CtrlCode, int CheckCode)
        {
            SerialDataResult result = await UpdateSerialServices.UpdateSerialNo(SerialNo, PartNo, CtrlCode, CheckCode);
            return Json(result);
        }
    }
}