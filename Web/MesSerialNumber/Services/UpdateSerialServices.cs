using MesSerialNumber.Constant;
using MesSerialNumber.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MesSerialNumber.Services
{
    public class UpdateSerialServices
    {
        public static vSerialData SearchSerialNo(string SerialNo)
        {
            using (var MESSNDBEntities = new MESSNDBEntities()) {
                return MESSNDBEntities.vSerialData.FirstOrDefault(p => p.SerialNo == SerialNo) ?? new vSerialData();
            }
        }
        public static async System.Threading.Tasks.Task<SerialDataResult> UpdateSerialNo(string SerialNo, string PartNo, int CtrlCode, int CheckCode)
        {
            List<APISerialData> apiSerialDataList = new List<APISerialData> {
                new APISerialData {
                    SerialNo = SerialNo,
                    PartNo = PartNo,
                    CtrlCode = CtrlCode,
                    CheckCode = CheckCode,
                    ModifyUser = (string)HttpContext.Current.Session[Common.ACCOUNT]
                }
            };
            string apiUrl = Common.API_DOMAIN_URL + Common.API_MODIFY_URL;
            Dictionary<string, List<APISerialData>> jsonDict = new Dictionary<string, List<APISerialData>>();
            jsonDict["SerialDataList"] = apiSerialDataList;
            string jsonString = JsonConvert.SerializeObject(jsonDict);
            return await UsingWebApi.JsonPostAsync<SerialDataResult>(apiUrl, Common.APP_JSON, jsonString);
        }
    }
}