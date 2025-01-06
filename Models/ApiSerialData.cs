using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MESSerialNumberAPI.Models
{
    public class ApiSerialData
    {
        public string SerialNumber { get; set; }
        public string PartNo { get; set; }
        public Nullable<int> ChangeCode { get; set; }
        public Nullable<int> CtrlCode { get; set; }
        public string InspectionData { get; set; }
        public string PropertyData { get; set; }
        public string ModifyUser { get; set; }
        public string Message { get; set; }  // message after executed
    }

    public class SerialDataResult 
    {
        public List<ApiSerialData> InsertSuccess { get; set; }
        public List<ApiSerialData> InsertFailed { get; set; }
        public List<ApiSerialData> UpdateSuccess { get; set; }
        public List<ApiSerialData> UpdateFailed { get; set; }
        public List<ApiSerialData> IncorrectData { get; set; }  // not add yet or exception occur when updateing data
        public SerialDataResult()
        {
            InsertSuccess = new List<ApiSerialData>();
            InsertFailed = new List<ApiSerialData>();
            UpdateSuccess = new List<ApiSerialData>();
            UpdateFailed = new List<ApiSerialData>();
            IncorrectData = new List<ApiSerialData>();
        }
    }

    public class QueryResult
    {
        public Dictionary<string, vPartMast> vPartMastDict { get; set; }
        public Dictionary<string, vSerialData> vSerialDataDict { get; set; }
    }

    public class SearchSerialData
    {
        public string PartNo { get; set; }
        public int IsLogical { get; set; }
        public string Coding { get; set; }
        public int IsValid { get; set; }  // 1: vaild; 0: not vaild
        public List<InspectionData> Inspection { get; set; }
        public List<PropertyData> Property { get; set; }
    }

    public class InspectionData
    {
        public string Item { set; get; }
        public string Value { set; get; }

    }
    public class PropertyData
    {
        public string Item { set; get; }
        public string Value { set; get; }
    }

    public class SearchSerialDataResult
    {
        public string SerialNumber { get; set; }
        public string Mo { get; set; }
        public List<SearchSerialData> SerialNumberLsit { get; set; }
    }

    public class BatchSerialData 
    {
        public string SerialNo { get; set; }
        public string PartNo { get; set; }
        public string PartDesc { get; set; }
        public Nullable<int> isDataVaild { get; set; }  // 0: invalid, 1: valid
        public Nullable<int> SerialType { get; set; }
    }

    public class ChangeLogResult 
    {
        public bool isValid { get; set; }
        public string errMessage { get; set; }
    }
    public class ProcessSerialDataRequest
    {
        public List<ApiSerialData> InputSerialData { get; set; }
    }

    public class SearchSerialNoRequest {
        public string SerialNo { get; set; }
        public string Mo { get; set; }
    }
}
