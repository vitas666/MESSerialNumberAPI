using MESSerialNumberAPI.Constant;
using MESSerialNumberAPI.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MESSerialNumberAPI.Services
{
    public class SearchSerialNoService
    {
        public static SearchSerialDataForFPResult GetSerialNo(string SerialNo)
        {
            SearchSerialDataForFPResult searchSerialDataForFPResult = new SearchSerialDataForFPResult {
                IsValid = 0,
                SerialNo = SerialNo,
                SerialCustPartNoList = new List<vSerialCustPartNo>()
            };
            List<vSerialCustPartNo> serialCustPartNoList = new List<vSerialCustPartNo>();

            if (string.IsNullOrEmpty(SerialNo))
            {
                searchSerialDataForFPResult.Message = Common.EMPTY_SERIALNO;
            }
            else
            {
                using (var CiMESDBEntities = new CiMESDBEntities())
                {
                    serialCustPartNoList = CiMESDBEntities.vSerialCustPartNo.Where(p => p.SerialNo == SerialNo).ToList() ?? new List<vSerialCustPartNo>();
                }

                searchSerialDataForFPResult.SerialCustPartNoList = serialCustPartNoList;
                int serialDataCount = serialCustPartNoList.Count;

                if (serialDataCount > 1)
                {
                    searchSerialDataForFPResult.Message = Common.SERIALNO_MULTIPLE_MATCH;
                }
                else if (serialDataCount == 0)
                {
                    searchSerialDataForFPResult.Message = Common.EMPTY_SERIALNO_DATA;
                }
                else if (serialDataCount == 1)
                {
                    vSerialCustPartNo vSerialCustPartNo = serialCustPartNoList[0];
                    if (!string.IsNullOrEmpty(vSerialCustPartNo.CustID) && 
                        !string.IsNullOrEmpty(vSerialCustPartNo.CustPartNo) &&
                        !string.IsNullOrEmpty(vSerialCustPartNo.PartNo))
                    {
                        searchSerialDataForFPResult.IsValid = 1;
                    }
                }
            }
            return searchSerialDataForFPResult;
        }

        public static SearchSerialDataResult GetSerialNo(string SerialNo, string Mo)
        {
            SearchSerialDataResult searchSerialDataResult = new SearchSerialDataResult();

            if (string.IsNullOrEmpty(SerialNo))
            {
                return searchSerialDataResult;
            }
            if (string.IsNullOrEmpty(Mo))
            {
                return searchSerialDataResult;
            }
            
            List<SearchSerialData> searchSerialDataList = new List<SearchSerialData>();
            searchSerialDataResult.SerialNo = SerialNo;
            searchSerialDataResult.MO = Mo;

            // Step 1
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                List<vSerialData> vSerialDataList = MESSNDBEntities.vSerialData.Where(p => p.SerialNo == SerialNo).ToList();

                if (vSerialDataList.Count > 0)
                {
                    vSerialDataList.ForEach(x =>
                    {
                        SearchSerialData searchSerialData = new SearchSerialData();
                        searchSerialData.PartNo = x.PartNo;
                        searchSerialData.Availability |= (x.CtrlCode ?? 0) & (int)ValidEnum.Qualified;
                        searchSerialData.MatchType = (int)LogicalEnum.ExistSerialNo;
                        searchSerialData.InspectionData = ConvertJsonToList<InspectionData>(x.InspectionData);
                        searchSerialData.PropertyData = ConvertJsonToList<PropertyData>(x.PropertyData);
                        searchSerialDataList.Add(searchSerialData);
                    });
                }

                List<vPartCoding> vPartCodingList = MESSNDBEntities.vPartCoding.ToList();
                vPartCodingList.ForEach(x =>
                {
                    if (SerialNo.Length == x.CodingRule.Length)
                    {
                        if (IsValidCoding(SerialNo, x.CodingRule))
                        {
                            var partnoData = searchSerialDataList.FirstOrDefault(p => p.PartNo == x.PartNo);
                            if (partnoData != null)
                            {
                                partnoData.MatchType |= (int)LogicalEnum.ComplyCoding;
                                partnoData.CodingRule = x.CodingRule;
                            }
                            else
                            {
                                SearchSerialData searchSerialData = new SearchSerialData();
                                searchSerialData.PartNo = x.PartNo;
                                searchSerialData.Availability |= (int)ValidEnum.Qualified;
                                searchSerialData.MatchType = (int)LogicalEnum.ComplyCoding;
                                searchSerialData.CodingRule = x.CodingRule;
                                searchSerialDataList.Add(searchSerialData);
                            }
                        }
                    }
                });
            }

            // Step 2
            
            using (var CiMESDBEntities = new CiMESDBEntities())
            {
                searchSerialDataList.ForEach(x =>
                {
                    vWOBOM vWobom = CiMESDBEntities.vWOBOM.Where(p => p.MATNR == x.PartNo && p.AUFNR == Mo).FirstOrDefault();
                    if (vWobom != null)
                    {
                        if (string.IsNullOrEmpty(vWobom.WOMatnr))
                        {
                            x.Availability |= (int)ValidEnum.ExistMoBom;
                        }
                        if (vWobom.WOMatnr == Common.Y)
                        {
                            x.Availability |= (int)ValidEnum.WosMatnrY;
                        }
                    }

                    // Step 3
                    //if (MES查詢)
                    //{
                    //    x.IsValid |= (int)ValidEnum.BurningCorrectly;
                    //}
                });
            }
            

            searchSerialDataResult.SerialDataLsit = searchSerialDataList;
            return searchSerialDataResult;
        }

        public static List<T> ConvertJsonToList<T>(string JsonString) where T : class, new()
        {
            List<T> dataList = new List<T>();
            if (!string.IsNullOrEmpty(JsonString) && IsValidJson(JsonString))
            {
                var jsonObject = JObject.Parse(JsonString);

                foreach (var property in jsonObject.Properties())
                {
                    T dataItem = new T();
                    var dataType = typeof(T);
                    var itemProperty = dataType.GetProperty("Item");
                    var valueProperty = dataType.GetProperty("Value");

                    if (itemProperty != null && valueProperty != null)
                    {
                        itemProperty.SetValue(dataItem, property.Name);
                        valueProperty.SetValue(dataItem, property.Value.ToString());
                    }
                    dataList.Add(dataItem);
                }
            }
            return dataList;
        }

        public static string ConvertListToJson<T>(List<T> DataList) where T : class, new()
        {
            var result = new Dictionary<string, object>();

            foreach (var data in DataList)
            {
                // Use reflection to get properties "Item" and "Value"
                var itemProperty = data.GetType().GetProperty("Item");
                var valueProperty = data.GetType().GetProperty("Value");

                if (itemProperty != null && valueProperty != null)
                {
                    var key = itemProperty.GetValue(data)?.ToString();
                    var value = valueProperty.GetValue(data);

                    if (key != null)
                    {
                        result[key] = value; // Add or update the key-value pair
                    }
                }
            }
            if (JsonConvert.SerializeObject(result) == "{}") 
            {
                return "";
            }
            // Convert the dictionary to a JSON string
            return JsonConvert.SerializeObject(result);
        }

        public static bool IsValidCoding(string SerialNo, string CodingRule)
        {
            for (int i = 0; i < CodingRule.Length; i++)
            {
                if (!CheckCondition(CodingRule[i], SerialNo[i]))
                {
                    return false;
                }
            }
            return true;
        }

        public static bool CheckCondition(char CodingChar, char SerialChar)
        {
            Dictionary<char, Func<char, bool>> conditionMap = new Dictionary<char, Func<char, bool>>()
            {
                { Common.HASHTAG, Char.IsDigit },
                { Common.DOLLAR, Char.IsLetter },
                { Common.PARENT, c => Char.IsDigit(c) || Char.IsLetter(c) }
            };

            if (conditionMap.ContainsKey(CodingChar))
            {
                return conditionMap[CodingChar](SerialChar);
            }

            return CodingChar == SerialChar;
        }

        public static List<BatchSerialData> BatchSearchSerialNo(DateTime? Date, string Status) 
        {
            DateTime parsedDate = Date.Value;
            List<BatchSerialData> result = new List<BatchSerialData>();

            using (MESSNDBEntities MESSNDBEntities = new MESSNDBEntities())
            {
                List<vSerialData> existingDataList = new List<vSerialData>();
                if (Status == Common.MODIFY)
                {
                    existingDataList = MESSNDBEntities.vSerialData.Where(s => s.ModifyDate > parsedDate).ToList();
                }
                else if (Status == Common.CREATE) 
                {
                    existingDataList = MESSNDBEntities.vSerialData.Where(s => s.CreatedDate > parsedDate).ToList();
                }

                foreach (vSerialData entity in existingDataList)
                {
                    List<InspectionData> dbInspectionData = ConvertJsonToList<InspectionData>(entity.InspectionData);
                    InspectionData voltage = dbInspectionData.Where(d => d.Item == "電壓").FirstOrDefault();
                    InspectionData speed = dbInspectionData.Where(d => d.Item == "轉速").FirstOrDefault();
                    InspectionData electronCurrent = dbInspectionData.Where(d => d.Item == "電流").FirstOrDefault();

                    BatchSerialData serialData = new BatchSerialData
                    {
                        SerialNo = entity.SerialNo,
                        PartNo = entity.PartNo,
                        PartDesc = entity.PartDesc,
                        IsDataVaild = (entity.CtrlCode & 1),  // 0: invalid, 1: valid
                        SerialType = entity.SerialType,
                        Voltage = voltage == null ? "" : voltage.Value,
                        Speed = speed == null ? "" : speed.Value,
                        ElectricCurrent = electronCurrent == null ? "" : electronCurrent.Value,
                    };
                    result.Add(serialData);
                }
            }
            return result;
        }

        public static bool IsValidJson(string jsonString) {
            if ((!jsonString.StartsWith("{") || !jsonString.EndsWith("}")))
            {
                return false;
            }
            try {
                var token = JToken.Parse(jsonString);
                return token is JObject || token is JArray;
            } catch (JsonReaderException) {
                return false;
            } catch (Exception) {
                return false;
            }
        }
    }
}