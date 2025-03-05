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
        [Route("api/GetSerialDataBySerialNoMO")]
        public IHttpActionResult GetSerialNo([FromBody] SearchSerialNoRequest SearchSerialNoRequest)
        {
            SearchSerialDataResult searchSerialDataResult = new SearchSerialDataResult();
            searchSerialDataResult = SearchSerialNoService.GetSerialNo(SearchSerialNoRequest.SerialNo, SearchSerialNoRequest.Mo);
            return Ok(searchSerialDataResult);
        }

        [HttpPost]
        [Route("api/GetCustInfoBySerialNo")]
        public IHttpActionResult GetSerialNoCustInfo([FromBody] SearchSerialNoRequest SearchSerialNoRequest)
        {
            SearchSerialDataForFPResult searchSerialDataForFPResult = new SearchSerialDataForFPResult();
            searchSerialDataForFPResult = SearchSerialNoService.GetSerialNo(SearchSerialNoRequest.SerialNo);
            return Ok(searchSerialDataForFPResult);
        }


        [HttpPost]
        [Route("api/GetSerialDataByModifyDate")]
        public IHttpActionResult GetSerialDataByModifyDate([FromBody] GetModifyDateRequest modifyDate)
        {
            if (!modifyDate.ModifyDate.HasValue)
            {
                return BadRequest("ModifyDate parameter is required.");
            }
            List<BatchSerialData> result = SearchSerialNoService.BatchSearchSerialNo(modifyDate.ModifyDate, "modify");
            return Ok(result);
        }

        [HttpPost]
        [Route("api/GetSerialDataByCreatedDate")]
        public IHttpActionResult GetSerialDataByCreatedDate([FromBody] GetCreatedDateRequest createdDate)
        {
            if (!createdDate.CreatedDate.HasValue)
            {
                return BadRequest("CreatedDate parameter is required.");
            }
            List<BatchSerialData> result = SearchSerialNoService.BatchSearchSerialNo(createdDate.CreatedDate, "create");
            return Ok(result);
        }
        // TODO: write down the http status for user
    }
}