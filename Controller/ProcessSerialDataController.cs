using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;
using System.Text.Json;
using MESSerialNumberAPI.Models;
using System.Web.Caching;
using System.Web.Mvc;
using MESSerialNumberAPI.Services;
using MESSerialNumberAPI.Middlewares;

namespace MESSerialNumberAPI.Controllers
{
    public class ProcessSerialDataController : ApiController
    {
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/UploadSerialDataByProductionLine")]
        public IHttpActionResult UploadSerialDataByProductionLine([FromBody] ProcessSerialDataRequest inputSerialData) 
        {
            SerialDataResult result = ProcessSerialData(inputSerialData.InputSerialData, "UploadSerialDataByProductionLine", 1024, 1);
            return Ok(result);
        }
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/ModifySerialDataByProductionLine")]
        public IHttpActionResult ModifySerialDataByProductionLine([FromBody] ProcessSerialDataRequest inputSerialData)
        {
            SerialDataResult result = ProcessSerialData(inputSerialData.InputSerialData, "ModifySerialDataByProductionLine", 1024, 2);
            return Ok(result);
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/UploadSerialDataByEP")]
        public IHttpActionResult UploadSerialDataByEP([FromBody] ProcessSerialDataRequest inputSerialData)
        {
            SerialDataResult result = ProcessSerialData(inputSerialData.InputSerialData, "UploadSerialDataByEP", 512, 1);
            return Ok(result);
        }
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/ModifySerialDataByEP")]
        public IHttpActionResult ModifySerialDataByEP([FromBody] ProcessSerialDataRequest inputSerialData)
        {
            SerialDataResult result = ProcessSerialData(inputSerialData.InputSerialData, "ModifySerialDataByEP", 512, 2);
            return Ok(result);
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/UploadSerialDataByElectronInspectionCenter")]
        public IHttpActionResult UploadSerialDataByElectronInspectionCenter([FromBody] ProcessSerialDataRequest inputSerialData)
        {
            SerialDataResult result = ProcessSerialData(inputSerialData.InputSerialData, "UploadSerialDataByElectronInspectionCenter", 256, 1);
            return Ok(result);
        }
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/ModifySerialDataByElectronInspectionCenter")]
        public IHttpActionResult ModifySerialDataByElectronInspectionCenter([FromBody] ProcessSerialDataRequest inputSerialData)
        {
            SerialDataResult result = ProcessSerialData(inputSerialData.InputSerialData, "ModifySerialDataByElectronInspectionCenter", 256, 2);
            return Ok(result);
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/UploadSerialDataBySNPlatform")]
        public IHttpActionResult UploadSerialDataBySNPlatform([FromBody] ProcessSerialDataRequest inputSerialData)
        {
            SerialDataResult result = ProcessSerialData(inputSerialData.InputSerialData, "UploadSerialDataBySNPlatform", 128, 1);
            return Ok(result);
        }
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/ModifySerialDataBySNPlatform")]
        public IHttpActionResult ModifySerialDataBySNPlatform([FromBody] ProcessSerialDataRequest inputSerialData)
        {
            SerialDataResult result = ProcessSerialData(inputSerialData.InputSerialData, "UploadSerialDataBySNPlatform", 128, 2);
            return Ok(result);
        }

        // this API is to trigger the upload function, given the input excel for some serial number data, then this API have to help user to check if the partNo exists or not in DB
        // input: list of Json string which contain all data inside excel
        // output: serialdata result, which is a list of models
        protected SerialDataResult ProcessSerialData(List<ApiSerialData> inputSerialData, string APIName, int factoryCode, int adjustType)
        {
            SerialDataResult result = new SerialDataResult();
            if (inputSerialData == null)
            {
                return result;
            }

            var checkDataFormat = checkSerialDataFormat.checkSerialData(inputSerialData);
            var dataAfterFormatChecked = new List<ApiSerialData>();
            foreach (var data in checkDataFormat) 
            {
                if (!data.isValid)
                {
                    data.SerialData.Message = data.errMessage;
                    result.IncorrectData.Add(data.SerialData);
                    continue;
                }
                else 
                {
                    dataAfterFormatChecked.Add(data.SerialData);
                }
            }
            
            QueryResult queryResult = new QueryResult();
            queryResult = SerialDataService.GetQueryResult(dataAfterFormatChecked);
            var vPartMastDict = queryResult.vPartMastDict;
            var vSerialDataDict = queryResult.vSerialDataDict;

            foreach (var data in dataAfterFormatChecked)
            {
                if (!vPartMastDict.ContainsKey(data.PartNo))
                {
                    data.Message = "PartNo does not exist";
                    result.IncorrectData.Add(data);
                    continue;
                }

                // Use SerialNumber to query SerialNo
                if (vSerialDataDict.ContainsKey(data.SerialNumber))
                {
                    var toModifyData = SerialDataService.updateSerialData(data, vPartMastDict[data.PartNo].PartID, factoryCode, adjustType, APIName);
                    if (toModifyData.isValid)
                    {
                        data.Message = "Update serial data successful";
                        result.UpdateSuccess.Add(data);
                    }
                    else
                    {
                        data.Message = $"Update serial data failed, message: {toModifyData.errMessage}";
                        result.UpdateFailed.Add(data);
                    }
                }
                else
                {
                    var toAddData = SerialDataService.addSerialData(data, vPartMastDict[data.PartNo].PartID, factoryCode, adjustType, APIName);
                    if (toAddData.isValid)
                    {
                        data.Message = "Add serial data successful";
                        result.InsertSuccess.Add(data);
                    }
                    else
                    {
                        data.Message = $"Add serial data failed, message: {toAddData.errMessage}";
                        result.InsertFailed.Add(data);
                    }
                }
            }

            //if (queryResult.Count != (result.UpdateSuccess.Count + result.UpdateFailed.Count + result.InsertSuccess.Count + result.InsertFailed.Count + result.IncorrectData.Count))
            //{
            //    throw new Exception("Incorrect data counts");
            //}
            
            return result;
        }
    }
}
