using System;
using System.Web.Http;
using MESSerialNumberAPI.Models;
using System.Web.Caching;
using MESSerialNumberAPI.Services;
using MESSerialNumberAPI.Constant;

namespace MESSerialNumberAPI.Controllers
{
    public class ProcessSerialDataController : ApiController
    {
        [HttpPost]
        [Route("api/UploadSerialDataByProductionLine")]
        public IHttpActionResult UploadSerialDataByProductionLine([FromBody] ProcessSerialDataRequest SerialDataRequest) 
        {
            SerialDataService SerialDataService = new SerialDataService();
            UploadSourceData uploadSourceData = new UploadSourceData()
            {
                APIName = Common.UPLOADSERIALDATABYPRODUCTIONLINE,
                FactoryCode = (int)UploadSourceEnum.ProductionLine,
                AdjustType = (int)AdjustTypeEnum.Upload
            };
            SerialDataResult result = SerialDataService.ProcessSerialData(SerialDataRequest.SerialDataList, uploadSourceData);
            return Ok(result);
        }
        [HttpPost]
        [Route("api/ModifySerialDataByProductionLine")]
        public IHttpActionResult ModifySerialDataByProductionLine([FromBody] ProcessSerialDataRequest SerialDataRequest)
        {
            SerialDataService SerialDataService = new SerialDataService();
            UploadSourceData uploadSourceData = new UploadSourceData()
            {
                APIName = Common.MODIFYSERIALDATABYPRODUCTIONLINE,
                FactoryCode = (int)UploadSourceEnum.ProductionLine,
                AdjustType = (int)AdjustTypeEnum.Modify
            };
            SerialDataResult result = SerialDataService.ProcessSerialData(SerialDataRequest.SerialDataList, uploadSourceData);
            return Ok(result);
        }

        [HttpPost]
        [Route("api/UploadSerialDataByEP")]
        public IHttpActionResult UploadSerialDataByEP([FromBody] ProcessSerialDataRequest SerialDataRequest)
        {
            SerialDataService SerialDataService = new SerialDataService();
            UploadSourceData uploadSourceData = new UploadSourceData()
            {
                APIName = Common.UPLOADSERIALDATABYEP,
                FactoryCode = (int)UploadSourceEnum.EP,
                AdjustType = (int)AdjustTypeEnum.Upload
            };
            SerialDataResult result = SerialDataService.ProcessSerialData(SerialDataRequest.SerialDataList, uploadSourceData);
            return Ok(result);
        }
        [HttpPost]
        [Route("api/ModifySerialDataByEP")]
        public IHttpActionResult ModifySerialDataByEP([FromBody] ProcessSerialDataRequest SerialDataRequest)
        {
            SerialDataService SerialDataService = new SerialDataService();
            UploadSourceData uploadSourceData = new UploadSourceData()
            {
                APIName = Common.MODIFYSERIALDATABYEP,
                FactoryCode = (int)UploadSourceEnum.EP,
                AdjustType = (int)AdjustTypeEnum.Modify
            };
            SerialDataResult result = SerialDataService.ProcessSerialData(SerialDataRequest.SerialDataList, uploadSourceData);
            return Ok(result);
        }

        [HttpPost]
        [Route("api/UploadSerialDataByElectronInspectionCenter")]
        public IHttpActionResult UploadSerialDataByElectronInspectionCenter([FromBody] ProcessSerialDataRequest SerialDataRequest)
        {
            SerialDataService SerialDataService = new SerialDataService();
            UploadSourceData uploadSourceData = new UploadSourceData()
            {
                APIName = Common.UPLOADSERIALDATABYELECTRONINSPECTIONCENTER,
                FactoryCode = (int)UploadSourceEnum.ElectronInspectionCenter,
                AdjustType = (int)AdjustTypeEnum.Upload
            };
            SerialDataResult result = SerialDataService.ProcessSerialData(SerialDataRequest.SerialDataList, uploadSourceData);
            return Ok(result);
        }
        [HttpPost]
        [Route("api/ModifySerialDataByElectronInspectionCenter")]
        public IHttpActionResult ModifySerialDataByElectronInspectionCenter([FromBody] ProcessSerialDataRequest SerialDataRequest)
        {
            SerialDataService SerialDataService = new SerialDataService();
            UploadSourceData uploadSourceData = new UploadSourceData()
            {
                APIName = Common.MODIFYSERIALDATABYELECTRONINSPECTIONCENTER,
                FactoryCode = (int)UploadSourceEnum.ElectronInspectionCenter,
                AdjustType = (int)AdjustTypeEnum.Modify
            };
            SerialDataResult result = SerialDataService.ProcessSerialData(SerialDataRequest.SerialDataList, uploadSourceData);
            return Ok(result);
        }

        [HttpPost]
        [Route("api/UploadSerialDataBySNPlatform")]
        public IHttpActionResult UploadSerialDataBySNPlatform([FromBody] ProcessSerialDataRequest SerialDataRequest)
        {
            SerialDataService SerialDataService = new SerialDataService();
            UploadSourceData uploadSourceData = new UploadSourceData()
            {
                APIName = Common.UPLOADSERIALDATABYSNPLATFORM,
                FactoryCode = (int)UploadSourceEnum.SNPlatform,
                AdjustType = (int)AdjustTypeEnum.Upload
            };
            SerialDataResult result = SerialDataService.ProcessSerialData(SerialDataRequest.SerialDataList, uploadSourceData);
            return Ok(result);
        }
        [HttpPost]
        [Route("api/ModifySerialDataBySNPlatform")]
        public IHttpActionResult ModifySerialDataBySNPlatform([FromBody] ProcessSerialDataRequest SerialDataRequest)
        {
            SerialDataService SerialDataService = new SerialDataService();
            UploadSourceData uploadSourceData = new UploadSourceData()
            {
                APIName = Common.MODIFYSERIALDATABYSNPLATFORM,
                FactoryCode = (int)UploadSourceEnum.SNPlatform,
                AdjustType = (int)AdjustTypeEnum.Modify
            };
            SerialDataResult result = SerialDataService.ProcessSerialData(SerialDataRequest.SerialDataList, uploadSourceData);
            return Ok(result);
        }
    }
}
