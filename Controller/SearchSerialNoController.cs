using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using MESSerialNumberAPI.Services;
using MESSerialNumberAPI.Constant;
using MESSerialNumberAPI.Models;
using Newtonsoft.Json.Linq;

namespace MESSerialNumberAPI.Controllers
{
    public class SearchSerialNoController : ApiController
    {
        [HttpPost]
        [Route("api/GetSerialNo")]
        public IHttpActionResult GetSerialNo([FromBody] SearchSerialNoRequest SearchSerialNoRequest)
        {
            SearchSerialDataResult searchSerialDataResult = new SearchSerialDataResult();
            searchSerialDataResult = SearchSerialNoService.GetSerialNo(SearchSerialNoRequest.SerialNo, SearchSerialNoRequest.Mo);
            return Ok(searchSerialDataResult);
        }

        [HttpPost]
        [Route("api/GetSerialNoCustInfo")]
        public IHttpActionResult GetSerialNoCustInfo([FromBody] SearchSerialNoRequest SearchSerialNoRequest)
        {
            List<vSerialCustPartNo> serialCustPartNoDatas = new List<vSerialCustPartNo>();
            serialCustPartNoDatas = SearchSerialNoService.GetSerialNo(SearchSerialNoRequest.SerialNo);
            return Ok(serialCustPartNoDatas);
        }

        [HttpPost]
        [Route("api/batchSearchSerialNoByModifyDate")]
        public IHttpActionResult BatchSearchSerialNoByModifyDate(string Date, string user)
        {
            DateTime parsedDate;
            if (string.IsNullOrEmpty(Date))
            {
                return BadRequest("Date is required.");
            }
            if (!DateTime.TryParse(Date, out parsedDate))
            {
                return BadRequest("Invalid date format. Please use a valid date format.");
            }
            var result = new List<BatchSerialData>();
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                var existingData = MESSNDBEntities.vSerialData.Where(s => s.ModifyDate < parsedDate).ToList();
                foreach (var entity in existingData)
                {
                    var serialData = new BatchSerialData
                    {
                        SerialNo = entity.SerialNo,
                        PartNo = entity.PartNo,
                        PartDesc = entity.PartDesc,
                        isDataVaild = (entity.CtrlCode & 1),  // 0: invalid, 1: valid
                        SerialType = entity.SerialType,
                    };
                    result.Add(serialData);
                }
            }
            return Ok(result);
        }

        [HttpPost]
        [Route("api/batchSearchSerialNoByCreatedDate")]
        public IHttpActionResult BatchSearchSerialNoByCreatedDate(string Date, string user)
        {
            DateTime parsedDate;
            if (string.IsNullOrEmpty(Date))
            {
                return BadRequest("Date parameter is required.");
            }
            if (!DateTime.TryParse(Date, out parsedDate))
            {
                return BadRequest("Invalid date format. Please use a valid date format.");
            }
            var result = new List<BatchSerialData>();
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                var existingData = MESSNDBEntities.vSerialData.Where(s => s.ModifyDate < parsedDate).ToList();
                foreach (var entity in existingData)
                {
                    var serialData = new BatchSerialData
                    {
                        SerialNo = entity.SerialNo,
                        PartNo = entity.PartNo,
                        PartDesc = entity.PartDesc,
                        isDataVaild = (entity.CtrlCode & 1),  // 0: invalid, 1: valid
                        SerialType = entity.SerialType,
                    };
                    result.Add(serialData);
                }
            }
            return Ok(result);
        }
    }
}
