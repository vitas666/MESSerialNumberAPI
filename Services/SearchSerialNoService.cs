using MESSerialNumberAPI.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MESSerialNumberAPI.Services
{
    public class SearchSerialNoService
    {
        public static List<vSerialCustPartNo> GetSerialNo(string SerialNo)
        {
            List<vSerialCustPartNo> serialCustPartNoDatas = new List<vSerialCustPartNo>();
            if (string.IsNullOrEmpty(SerialNo))
            {
                return serialCustPartNoDatas;
            }
            
            using (var CiMESDBEntities = new CiMESDBEntities())
            {
                serialCustPartNoDatas = CiMESDBEntities.vSerialCustPartNo.Where(p => p.SerialNo == SerialNo).ToList();
            }
            return serialCustPartNoDatas;
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
            searchSerialDataResult.SerialNumber = SerialNo;
            searchSerialDataResult.Mo = Mo;

            // Step 1
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                var serialDatas = MESSNDBEntities.vSerialData.Where(p => p.SerialNo == SerialNo).ToList();

                if (serialDatas.Count > 0)
                {
                    serialDatas.ForEach(x =>
                    {
                        SearchSerialData searchSerialData = new SearchSerialData();
                        searchSerialData.PartNo = x.PartNo;
                        searchSerialData.IsValid |= (x.CtrlCode ?? 0) & 1;
                        searchSerialData.IsLogical = 1;
                        searchSerialData.Inspection = ConvertJsonToList<InspectionData>(x.InspectionData);
                        searchSerialData.Property = ConvertJsonToList<PropertyData>(x.PropertyData);
                        searchSerialDataList.Add(searchSerialData);
                    });
                }

                var partCodingDatas = MESSNDBEntities.vPartCoding.ToList();
                partCodingDatas.ForEach(x =>
                {
                    if (SerialNo.Length == x.CodingRule.Length)
                    {
                        if (IsValidCoding(SerialNo, x.CodingRule))
                        {
                            var partnoData = searchSerialDataList.FirstOrDefault(p => p.PartNo == x.PartNo);
                            if (partnoData != null)
                            {
                                partnoData.IsLogical |= 2;
                            }
                            else
                            {
                                SearchSerialData searchSerialData = new SearchSerialData();
                                searchSerialData.PartNo = x.PartNo;
                                searchSerialData.IsValid |= 1;
                                searchSerialData.IsLogical = 2;
                                searchSerialData.Coding = x.CodingRule;
                                searchSerialDataList.Add(searchSerialData);
                            }
                        }
                    }
                });
            }

            // Step 2
            searchSerialDataList.ForEach(x =>
            {
                using (var CiMESDBEntities = new CiMESDBEntities())
                {
                    //工單跟料號的欄位 TODO
                    var bomDatas = CiMESDBEntities.IF_WO_BOM.Where(p => p.MATNR == SerialNo && p.AUFNR == Mo);
                    if (bomDatas.Any())
                    {
                        x.IsValid |= 2;
                    }
                }
            });

            searchSerialDataResult.SerialNumberLsit = searchSerialDataList;
            return searchSerialDataResult;
        }

        public static List<T> ConvertJsonToList<T>(string jsonString) where T : class, new()
        {
            var dataList = new List<T>();
            if (!string.IsNullOrEmpty(jsonString))
            {
                var jsonObject = JObject.Parse(jsonString);

                foreach (var property in jsonObject.Properties())
                {
                    var dataItem = new T();
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

        public static bool IsValidCoding(string serialNo, string codingRule)
        {
            for (int i = 0; i < codingRule.Length; i++)
            {
                if (!CheckCondition(codingRule[i], serialNo[i]))
                {
                    return false;
                }
            }
            return true;
        }

        public static bool CheckCondition(char codingChar, char serialChar)
        {
            var conditionMap = new Dictionary<char, Func<char, bool>>()
            {
                { '#', Char.IsDigit },
                { '$', Char.IsLetter },
                { '%', c => Char.IsDigit(c) || Char.IsLetter(c) }
            };

            if (conditionMap.ContainsKey(codingChar))
            {
                return conditionMap[codingChar](serialChar);
            }

            return codingChar == serialChar;
        }
    }
}
