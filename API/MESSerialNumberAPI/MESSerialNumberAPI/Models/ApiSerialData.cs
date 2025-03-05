using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MESSerialNumberAPI.Models
{
    public class ApiSerialData
    {
        public string SerialNo { get; set; }
        public string PartNo { get; set; }
        public Nullable<int> CheckCode { get; set; }
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

    public class SearchSerialData
    {
        public string PartNo { get; set; }
        public int MatchType { get; set; }
        public string CodingRule { get; set; }
        public int Availability { get; set; }  // 1: vaild; 0: not vaild
        public List<InspectionData> InspectionData { get; set; }
        public List<PropertyData> PropertyData { get; set; }
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
        public string SerialNo { get; set; }
        public string MO { get; set; }
        public List<SearchSerialData> SerialDataLsit { get; set; }
    }

    public class SearchSerialDataForFPResult
    {
        public string SerialNo { get; set; }
        public int IsValid { get; set; }
        public string Message { get; set; }
        public List<vSerialCustPartNo> SerialCustPartNoList { get; set; }
    }

    public class BatchSerialData 
    {
        public string SerialNo { get; set; }
        public string PartNo { get; set; }
        public string PartDesc { get; set; }
        public Nullable<int> IsDataVaild { get; set; }  // 0: invalid, 1: valid
        public Nullable<int> SerialType { get; set; }
        public string Voltage { get; set; }
        public string Speed { get; set; }
        public string ElectricCurrent { get; set; }
    }

    public class ProcessSerialDataRequest
    {
        public List<ApiSerialData> SerialDataList { get; set; }
    }

    public class GetCreatedDateRequest 
    {
        public DateTime? CreatedDate { get; set; }
    }

    public class GetModifyDateRequest
    {
        public DateTime? ModifyDate { get; set; }
    }

    public class SearchSerialNoRequest {
        public string SerialNo { get; set; }
        public string Mo { get; set; }
    }

    public class UploadSourceData
    {
        public string APIName { get; set; }
        public int FactoryCode { get; set; }
        public int AdjustType { get; set; }
    }

    public class CheckSerialDataFormat
    {
        public ApiSerialData SerialData { get; set; }
        public bool IsValid { get; set; } = true;
        public string ErrMessage { get; set; } = "";
    }
}