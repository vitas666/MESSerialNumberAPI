using System;
using System.Collections.Generic;
using System.Linq;
using MESSerialNumberAPI.Models;
using MESSerialNumberAPI.Constant;
using System.Data.Entity;

namespace MESSerialNumberAPI.Services
{
    public class SerialDataService
    {
        // this API is to trigger the upload function, given the input excel for some serial number data, then this API have to help user to check if the partNo exists or not in DB
        // input: list of Json string which contain all data inside excel
        // output: serialdata result, which is a list of models
        public SerialDataResult ProcessSerialData(List<ApiSerialData> SerialDataList, UploadSourceData UploadSourceData)
        {
            SerialDataResult result = new SerialDataResult();
            if (SerialDataList == null)
            {
                return result;
            }

            List<CheckSerialDataFormat> checkDataFormat = CheckSerialData(SerialDataList);
            List<ApiSerialData> dataAfterFormatChecked = new List<ApiSerialData>();
            foreach (CheckSerialDataFormat data in checkDataFormat)
            {
                if (!data.IsValid)
                {
                    data.SerialData.Message = data.ErrMessage;
                    result.IncorrectData.Add(data.SerialData);
                    continue;
                }
                else
                {
                    dataAfterFormatChecked.Add(data.SerialData);
                }
            }

            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                foreach (ApiSerialData data in dataAfterFormatChecked)
                {
                    List<vPartMast> vPartMastList = MESSNDBEntities.vPartMast.ToList();
                    List<vSerialData> vSerialDataList = MESSNDBEntities.vSerialData.ToList();
                    Dictionary<string, List<vPartMast>> vPartMastDict = new Dictionary<string, List<vPartMast>>();
                    vPartMastList.ForEach(x =>
                    {
                        if (!vPartMastDict.ContainsKey(x.PartNo))
                        {
                            vPartMastDict[x.PartNo] = new List<vPartMast>();
                        }
                        vPartMastDict[x.PartNo].Add(x);
                    });
                    Dictionary<string, List<vSerialData>> vSerialDataDict = new Dictionary<string, List<vSerialData>>();
                    vSerialDataList.ForEach(x =>
                    {
                        if (!vSerialDataDict.ContainsKey(x.SerialNo))
                        {
                            vSerialDataDict[x.SerialNo] = new List<vSerialData>();
                        }
                        vSerialDataDict[x.SerialNo].Add(x);
                    });

                    if (!vPartMastDict.ContainsKey(data.PartNo))
                    {
                        data.Message = Common.PARTNO_NOT_EXIST;
                        result.IncorrectData.Add(data);
                        continue;
                    }
                    if (vPartMastDict[data.PartNo].Count > 1)
                    {
                        data.Message = Common.DUPLICATE_PARTNO;
                        result.IncorrectData.Add(data);
                        continue;
                    }
                    if (!vSerialDataDict.ContainsKey(data.SerialNo)) 
                    {
                        vSerialDataDict[data.SerialNo] = new List<vSerialData>();
                    }
                    if (vSerialDataDict[data.SerialNo].Count > 1)
                    {
                        data.Message = Common.DUPLICATE_SERIALNO;
                        result.IncorrectData.Add(data);
                        continue;
                    }
                    // Prepare lists from input data
                    if (!string.IsNullOrEmpty(data.InspectionData) && !SearchSerialNoService.IsValidJson(data.InspectionData))
                    {
                        data.Message = Common.INCORRECT_INSPECTION_DATA;
                        result.IncorrectData.Add(data);
                        continue;
                    }
                    if (!string.IsNullOrEmpty(data.PropertyData) && !SearchSerialNoService.IsValidJson(data.PropertyData))
                    {
                        data.Message = Common.INCORRECT_PROPERTY_DATA;
                        result.IncorrectData.Add(data);
                        continue;
                    }

                    if (vSerialDataDict.ContainsKey(data.SerialNo) && vSerialDataDict[data.SerialNo].Count != 0)
                    {
                        // update serial data
                        try
                        {
                            int partID = vPartMastDict[data.PartNo][0].PartID;
                            int? vPartMastCtrlCode = vPartMastDict[data.PartNo][0].CtrlCode;
                            int? vSerialDataCtrlCode = vSerialDataDict[data.SerialNo][0].CtrlCode;
                            int ctrlCode = GetUpdateCtrlCode(data, vPartMastCtrlCode, vSerialDataCtrlCode, UploadSourceData.AdjustType, UploadSourceData.FactoryCode);

                            // Fetch existing data for the given SerialNumber
                            List<SerialData> existingDataList = MESSNDBEntities.SerialData
                                .Where(p => p.SerialNo == data.SerialNo)
                                .ToList();

                            List<InspectionData> inspectionList = SearchSerialNoService.ConvertJsonToList<InspectionData>(data.InspectionData);
                            List<PropertyData> propertyList = SearchSerialNoService.ConvertJsonToList<PropertyData>(data.PropertyData);
                            List<SerialHist> logData = new List<SerialHist>();

                            foreach (SerialData existingData in existingDataList)
                            {
                                // Convert existing data to lists for comparison
                                List<InspectionData> dbInspectionData = SearchSerialNoService.ConvertJsonToList<InspectionData>(existingData.InspectionData);
                                List<PropertyData> dbProperyData = SearchSerialNoService.ConvertJsonToList<PropertyData>(existingData.PropertyData);

                                // Merge new inspection data
                                foreach (InspectionData inspection in inspectionList)
                                {
                                    if (!dbInspectionData.Contains(inspection))
                                    {
                                        dbInspectionData.Add(inspection);
                                    }
                                    else
                                    {
                                        dbInspectionData.Where(d => d.Item == inspection.Item).FirstOrDefault().Value = inspection.Value;
                                    }
                                }

                                foreach (PropertyData property in propertyList)
                                {
                                    if (!dbProperyData.Contains(property))
                                    {
                                        dbProperyData.Add(property);
                                    }
                                    else
                                    {
                                        dbProperyData.Where(d => d.Item == property.Item).FirstOrDefault().Value = property.Value;
                                    }
                                }

                                // Update existing SerialData fields
                                existingData.PartID = partID;
                                existingData.InspectionData = SearchSerialNoService.ConvertListToJson(dbInspectionData);
                                existingData.PropertyData = SearchSerialNoService.ConvertListToJson(dbProperyData);
                                existingData.CtrlCode = ctrlCode;
                                existingData.ModifyDate = DateTime.Now;
                                MESSNDBEntities.Entry(existingData).State = EntityState.Modified;

                                // Create log entry for each modified SerialData
                                logData.Add(new SerialHist
                                {
                                    SerialHistID = GetLastNo.GetSctlMastNo(Common.SCRM_KEY_SERIAL_HIST),
                                    SerialID = existingData.SerialID,
                                    PartID = partID,
                                    InspectionData = data.InspectionData,
                                    PropertyData = data.PropertyData,
                                    CheckCode = data.CheckCode == null ? null : data.CheckCode,
                                    CtrlCode = ((data.CtrlCode == null ? null : data.CtrlCode) | UploadSourceData.FactoryCode),
                                    SourceName = UploadSourceData.APIName,
                                    UserName = data.ModifyUser,
                                    CreatedDate = DateTime.Now,
                                    ModifyDate = DateTime.Now
                                });
                            }

                            foreach (SerialHist entity in logData)
                            {
                                MESSNDBEntities.SerialHist.Add(entity);
                            }

                            MESSNDBEntities.SaveChanges();
                            
                            data.Message = "Update serial data successful";
                            result.UpdateSuccess.Add(data);
                        }
                        catch (Exception ex)
                        {
                            data.Message = $"Update serial data failed, message: {ex.Message}";
                            result.UpdateFailed.Add(data);
                        }
                    }
                    else
                    {
                        // insert new serial data
                        try
                        {
                            int createSerialID = GetLastNo.GetSctlMastNo(Common.SCRM_KEY_SERIAL_MAST);
                            int? sourceCtrlCode = vPartMastDict[data.PartNo][0].CtrlCode;
                            int ctrlCode = GetInsertCtrlCode(data, sourceCtrlCode, UploadSourceData.AdjustType, UploadSourceData.FactoryCode);
                            int partID = vPartMastDict[data.PartNo][0].PartID;

                            List<InspectionData> inspectionDataList = SearchSerialNoService.ConvertJsonToList<InspectionData>(data.InspectionData);
                            List<PropertyData> properyDataList = SearchSerialNoService.ConvertJsonToList<PropertyData>(data.PropertyData);
                            var inspectionDataToAdd = SearchSerialNoService.ConvertListToJson(inspectionDataList);
                            var propertyDataToAdd = SearchSerialNoService.ConvertListToJson(properyDataList);

                            SerialData dataToAdd = new SerialData
                            {
                                SerialID = createSerialID,
                                SerialNo = data.SerialNo,
                                PartID = vPartMastDict[data.PartNo][0].PartID,
                                InspectionData = inspectionDataToAdd,
                                PropertyData = propertyDataToAdd,
                                CtrlCode = ctrlCode,
                                CreatedDate = DateTime.Now,
                                ModifyDate = DateTime.Now
                            };

                            // Add new SerialData to the database
                            MESSNDBEntities.SerialData.Add(dataToAdd);

                            SerialHist logToAdd = new SerialHist
                            {
                                SerialHistID = GetLastNo.GetSctlMastNo(Common.SCRM_KEY_SERIAL_HIST),
                                SerialID = createSerialID,
                                PartID = partID,
                                InspectionData = data.InspectionData,
                                PropertyData = data.PropertyData,
                                CheckCode = data.CheckCode == null ? null : data.CheckCode,
                                CtrlCode = ((data.CtrlCode == null ? null : data.CtrlCode) | UploadSourceData.FactoryCode),
                                SourceName = UploadSourceData.APIName,
                                UserName = data.ModifyUser,
                                CreatedDate = DateTime.Now,
                                ModifyDate = DateTime.Now
                            };

                            MESSNDBEntities.SerialHist.Add(logToAdd);
                            MESSNDBEntities.SaveChanges();

                            data.Message = "Add serial data successful";
                            result.InsertSuccess.Add(data);
                        }
                        catch (Exception ex)
                        {
                            data.Message = $"Add serial data failed, message: {ex.Message}";
                            result.InsertFailed.Add(data);
                        }
                    }
                }
                return result;
            }
        }

        private int GetInsertCtrlCode(ApiSerialData Data, int? CtrlCode, int AdjustType, int FactorySource)
        {
            int byteCtrlCode = ConvertToBitInt(Data.CtrlCode);
            int byteChangeCode = ConvertToBitInt(Data.CheckCode);
            int byteFactoryCode = ConvertToBitInt(FactorySource);
            int maxBitLength = Math.Max(
                Math.Max(GetBitLength(byteCtrlCode), GetBitLength(byteChangeCode)),
                GetBitLength(byteFactoryCode)
            );

            int result = 0;
            int bytePartMastCtrlCode = ConvertToBitInt(CtrlCode);

            for (int idx = 0; idx < maxBitLength; idx++)
            {
                int ctrlBit = (byteCtrlCode >> idx) & 1;
                int changeBit = (byteChangeCode >> idx) & 1;
                int partBit = (bytePartMastCtrlCode >> idx) & 1;
                int factoryBit = (byteFactoryCode >> idx) & 1;

                int calculatedBit;

                if (AdjustType == (int)AdjustTypeEnum.Upload && changeBit == (int)CheckCodeEnum.Checked && idx == 0)
                {
                    calculatedBit = (partBit & ctrlBit) | factoryBit;
                }
                else
                {
                    calculatedBit = (ctrlBit & changeBit) | factoryBit;
                }
                result |= (calculatedBit << idx);
            }
            
            return result;
        }

        private int GetUpdateCtrlCode(ApiSerialData Data, int? PartMastCtrlCode, int? SerialDataCtrlCode, int AdjustType, int FactorySource)
        {
            int byteCtrlCode = ConvertToBitInt(Data.CtrlCode);
            int byteChangeCode = ConvertToBitInt(Data.CheckCode);
            int byteFactoryCode = ConvertToBitInt(FactorySource);
            int bytePartMastCtrlCode = ConvertToBitInt(PartMastCtrlCode);
            int byteSerialDataCtrlCodde = ConvertToBitInt(SerialDataCtrlCode);

            int maxBitLength = Math.Max(
                Math.Max(GetBitLength(byteCtrlCode), GetBitLength(byteChangeCode)),
                GetBitLength(byteFactoryCode)
            );

            int result = 0;

            for (int idx = 0; idx < maxBitLength; idx++)
            {
                int calculatedBit;
                int ctrlBit = (byteCtrlCode >> idx) & 1;
                int changeBit = (byteChangeCode >> idx) & 1;
                int partBit = (bytePartMastCtrlCode >> idx) & 1;
                int serialDataBit = (byteSerialDataCtrlCodde >> idx) & 1;

                if (AdjustType == (int)AdjustTypeEnum.Upload && changeBit == (int)CheckCodeEnum.Checked && idx == 0)
                {
                    calculatedBit = (serialDataBit | changeBit) ^ changeBit | (partBit & changeBit);
                }
                else
                {
                    calculatedBit = (serialDataBit | changeBit) ^ changeBit | (ctrlBit & changeBit);
                }

                result |= (calculatedBit << idx);
            }
            return result;
        }

        private static int GetBitLength(int Number)
        {
            if (Number == 0) return 1;
            return (int)Math.Floor(Math.Log(Number, 2)) + 1;
        }

        private static int ConvertToBitInt(int? Number)
        {
            return Number.HasValue ? Number.Value : 0;
        }

        private List<CheckSerialDataFormat> CheckSerialData(List<ApiSerialData> SerialDataList)
        {
            var resultList = new List<CheckSerialDataFormat>();

            foreach (var data in SerialDataList)
            {
                CheckSerialDataFormat result = new CheckSerialDataFormat();
                result.SerialData = data;
                List<string> errMessage = new List<string>();
                if (String.IsNullOrEmpty(data.SerialNo))
                {
                    errMessage.Add(Common.EMPTY_SERIALNO);
                    result.IsValid = false;
                }
                if (String.IsNullOrEmpty(data.PartNo))
                {
                    errMessage.Add(Common.EMPTY_PARTNO);
                    result.IsValid = false;
                }
                if (errMessage.Any())
                {
                    result.IsValid = false;
                    result.ErrMessage = string.Join(", ", errMessage);
                }
                resultList.Add(result);
            }
            return resultList;
        }
    }
}