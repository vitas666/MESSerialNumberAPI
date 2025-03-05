using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MesSerialNumber.Models
{
    public class APISerialData
    {
        public string SerialNo { get; set; }
        public string PartNo { get; set; }
        public string InspectionData { get; set; }
        public string PropertyData { get; set; }
        public string ModifyUser { get; set; }
        public string Message { get; set; }
        public Nullable<int> CheckCode { get; set; }
        public Nullable<int> CtrlCode { get; set; }
    }

    public class SerialDataResult
    {
        public List<APISerialData> InsertSuccess { get; set; }
        public List<APISerialData> InsertFailed { get; set; }
        public List<APISerialData> UpdateSuccess { get; set; }
        public List<APISerialData> UpdateFailed { get; set; }
        public List<APISerialData> IncorrectData { get; set; }
    }
}