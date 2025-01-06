using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MESSerialNumberAPI.Models;

namespace MESSerialNumberAPI.Middlewares
{
    public class checkSerialDataFormat
    {
        public static List<CheckSerialDataFormat> checkSerialData(List<ApiSerialData> inputSerialData) 
        {
            var resultList = new List<CheckSerialDataFormat>();
            string errMessage = "";
            foreach (var data in inputSerialData) 
            {
                var result = new CheckSerialDataFormat();
                result.SerialData = data;
                if (String.IsNullOrEmpty(data.SerialNumber))
                {
                    errMessage = "SerialNumber is empty";
                    result.isValid = false;
                    result.errMessage = errMessage;
                }
                if (String.IsNullOrEmpty(data.PartNo)) 
                {
                    errMessage = "PartNo is empty";
                    result.isValid = false;
                    result.errMessage = errMessage;
                }
                resultList.Add(result);
            }
            return resultList;
        }
    }
    public class CheckSerialDataFormat
    {
        public ApiSerialData SerialData { get; set; }
        public bool isValid { get; set; } = true;
        public string errMessage { get; set; } = "";
    }
}
