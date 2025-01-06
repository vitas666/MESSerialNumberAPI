using System;
using System.Collections.Generic;
using System.Linq;
using MESSerialNumberAPI.Models;
using MESSerialNumberAPI.Constant;
using MESSerialNumberAPI.Services;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace MESSerialNumberAPI.Services
{
    public class SerialDataService
    {
        // factory code will be hardcode, and Jorden will provide the information later
        public static ChangeLogResult addSerialData(ApiSerialData inputData, int partID, int factorySource, int adjustType, string fn)
        {
            var result = new ChangeLogResult();
            bool isValid = true;
            string errMessage = "";

            try
            {
                using (var MESSNDBEntities = new MESSNDBEntities()) 
                {
                    var dataToAdd = AddDBSerialData(inputData, partID, adjustType, factorySource);
                    var logData = WriteDBLogData(inputData, partID, adjustType, factorySource, fn);
                    MESSNDBEntities.SerialData.Add(dataToAdd);
                    foreach (var entity in logData) 
                    {
                        MESSNDBEntities.SerialHist.Add(entity);
                    }
                    MESSNDBEntities.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                result.errMessage = ex.InnerException.Message;
                result.isValid = false;
                return result;
            }
            
            result.isValid = isValid;
            result.errMessage = errMessage;
            return result;
        }

        public static ChangeLogResult updateSerialData(ApiSerialData inputData, int partID, int factorySource, int adjustType, string fn)
        {
            var result = new ChangeLogResult();
            bool isValid = true;
            string errMessage = "";

            try
            {
                using (var MESSNDBEntities = new MESSNDBEntities()) 
                {
                    var dataToModify = UpdateDBSerialData(inputData, partID, adjustType, factorySource);
                    var logData = WriteDBLogData(inputData, partID, adjustType, factorySource, fn);
                    foreach (var entity in dataToModify) 
                    {
                        MESSNDBEntities.Entry(entity).State = EntityState.Modified;
                    }
                    foreach (var entity in logData) 
                    {
                        MESSNDBEntities.SerialHist.Add(entity);
                    }
                    MESSNDBEntities.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                result.errMessage = ex.Message;
                result.isValid = false;
                return result;
            }

            result.isValid = isValid;
            result.errMessage = errMessage;
            return result;
        }

        public static List<SerialHist> WriteDBLogData(ApiSerialData data, int partID, int adjustType, int factorySource, string fn)
        {
            List<SerialHist> result = new List<SerialHist>();
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                var dataToAdd = new SerialHist();
                var dbSerialDataID = MESSNDBEntities.SerialData.Where(s => s.SerialNo == data.SerialNumber).Select(s => s.SerialID).ToList();
                if (dbSerialDataID.Count == 0) 
                {
                    dataToAdd.SerialHistID = int.Parse(GetLastNo.GetSctlMastNo(Common.ScrmKeySerialHist));
                    dataToAdd.SerialID = int.Parse(GetLastNo.GetSctlMastNo(Common.ScrmKeySerialMast));
                    dataToAdd.PartID = partID;
                    dataToAdd.InspectionData = data.InspectionData;
                    dataToAdd.PropertyData = data.PropertyData;
                    dataToAdd.CheckCode = data.ChangeCode;
                    dataToAdd.CtrlCode = (data.CtrlCode | factorySource);
                    dataToAdd.SourceName = fn;
                    dataToAdd.UserName = data.ModifyUser;
                    dataToAdd.CreatedDate = DateTime.Now;
                    dataToAdd.ModifyDate = DateTime.Now;
                    result.Add(dataToAdd);
                    return result;
                }

                foreach (var dataID in dbSerialDataID) 
                {
                    dataToAdd.SerialHistID = int.Parse(GetLastNo.GetSctlMastNo(Common.ScrmKeySerialHist));
                    dataToAdd.SerialID = dataID;
                    dataToAdd.PartID = partID;
                    dataToAdd.InspectionData = data.InspectionData;
                    dataToAdd.PropertyData = data.PropertyData;
                    dataToAdd.CheckCode = data.ChangeCode;
                    dataToAdd.CtrlCode = (data.CtrlCode | factorySource);
                    dataToAdd.SourceName = fn;
                    dataToAdd.UserName = data.ModifyUser;
                    dataToAdd.CreatedDate = DateTime.Now;
                    dataToAdd.ModifyDate = DateTime.Now;
                    result.Add(dataToAdd);
                }
                return result;
            }
        }
        private static List<SerialData> UpdateDBSerialData(ApiSerialData data, int partID, int adjustType, int factorySource)
        {
            List<SerialData> result = new List<SerialData>();
            int? ctrlCode = getUpdateCtrlCode(data, adjustType, factorySource);
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                // consider the situation that we got 2 more same serial number
                var existingData = MESSNDBEntities.SerialData.Where(p => p.SerialNo == data.SerialNumber).ToList();
                foreach (var d in existingData)
                {
                    d.PartID = partID;
                    d.InspectionData = data.InspectionData;
                    d.PropertyData = data.PropertyData;
                    d.CtrlCode = ctrlCode;
                    d.ModifyDate = DateTime.Now;
                    result.Add(d);
                }
                return result;
            }
        }
        private static SerialData AddDBSerialData(ApiSerialData data, int partID, int adjustType, int factorySource)
        {
            int? ctrlCode = getInsertCtrlCode(data, adjustType, factorySource);
            var existingData = new SerialData();
            existingData.SerialID = int.Parse(GetLastNo.GetSctlMastNo(Common.ScrmKeySerialMast));
            existingData.SerialNo = data.SerialNumber;
            existingData.PartID = partID;
            existingData.InspectionData = data.InspectionData;
            existingData.PropertyData = data.PropertyData;
            existingData.CtrlCode = ctrlCode;
            existingData.CreatedDate = DateTime.Now;
            existingData.ModifyDate = DateTime.Now;
            return existingData;
        }

        //public void batchUpdateDBSerialData(List<ApiSerialData> serialDataList, int partID, int adjustType, int factorySource) 
        //{
        //    var serialNumbers = serialDataList.Select(data => data.SerialNumber).ToList();
        //    var dataToUpdate = new List<SerialData>();

        //    using (var MESSNDBEntities = new MESSNDBEntities())
        //    {
        //        // Query for existing SerialData
        //        var existingDataList = MESSNDBEntities.SerialData
        //            .Where(p => serialNumbers.Contains(p.SerialID.ToString()))
        //            .ToList();

        //        foreach (var data in serialDataList)
        //        {
        //            var existingData = existingDataList.FirstOrDefault(p => p.SerialID.ToString() == data.SerialNumber);
        //            if (existingData != null)
        //            {
        //                existingData.PartID = partID;
        //                existingData.InspectionData = data.InspectionData;
        //                existingData.PropertyData = data.PropertyData;
        //                existingData.CtrlCode = getUpdateCtrlCode(data, adjustType, factorySource);
        //                existingData.ModifyDate = DateTime.Now;

        //                MESSNDBEntities.SerialData.Add(existingData);
        //            }
        //        }
        //        MESSNDBEntities.SaveChanges();
        //    }
        //}

        //public void batchInsertDBSerialData(List<ApiSerialData> serialDataList, int partID, int adjustType, int factorySource)
        //{
        //    var dataToInsert = new List<SerialData>();

        //    using (var MESSNDBEntities = new MESSNDBEntities())
        //    {
        //        foreach (var data in serialDataList)
        //        {
        //            // Check if the SerialNumber already exists, if so skip it
        //            var existingData = MESSNDBEntities.SerialData.FirstOrDefault(p => p.SerialID.ToString() == data.SerialNumber);
        //            if (existingData == null)
        //            {
        //                var newSerialData = new SerialData
        //                {
        //                    SerialID = getSerialNoFromScrmKey(Common.ScrmKeySerialMast),
        //                    SerialNo = data.SerialNumber,
        //                    PartID = partID,
        //                    InspectionData = data.InspectionData,
        //                    PropertyData = data.PropertyData,
        //                    CtrlCode = getInsertCtrlCode(data, adjustType, factorySource),
        //                    CreatedDate = DateTime.Now,
        //                    ModifyDate = DateTime.Now
        //                };

        //                MESSNDBEntities.SerialData.Add(existingData);
        //            }
        //        }
        //        MESSNDBEntities.SaveChanges();
        //    }
        //}

        public static QueryResult GetQueryResult(List<ApiSerialData> inputData)
        {
            var result = new QueryResult();
            // the count of these 2 dicts might not be the same 
            var partNos = inputData
                .Where(data => !string.IsNullOrEmpty(data.PartNo))
                .Select(data => data.PartNo)
                .Distinct()
                .ToList();

            var serialNumbers = inputData
                .Where(data => !string.IsNullOrEmpty(data.SerialNumber))
                .Select(data => data.SerialNumber)
                .Distinct()
                .ToList();

            Dictionary<string, vPartMast> vPartMastDict;
            Dictionary<string, vSerialData> vSerialDataDict;
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                vPartMastDict = MESSNDBEntities.vPartMast
                    .Where(p => partNos.Contains(p.PartNo))
                    .GroupBy(p => p.PartNo)
                    .ToDictionary(p => p.Key, p => p.First());

                vSerialDataDict = MESSNDBEntities.vSerialData
                    .Where(s => serialNumbers.Contains(s.SerialNo))
                    .GroupBy(s => s.SerialNo)
                    .ToDictionary(s => s.Key, s => s.First());
            }
            result.vPartMastDict = vPartMastDict;
            result.vSerialDataDict = vSerialDataDict;
            return result;
        }
        //private static int getSerialNoFromScrmKey(string logCondition)
        //{
        //    using (var MESSNDBEntities = new MESSNDBEntities())
        //    {
        //        var result = MESSNDBEntities.SctlMast
        //            .Where(s => s.ScrmKey == logCondition)
        //            .Select(s => s.LastNo)
        //            .FirstOrDefault();
        //        return (int)Math.Floor(result.Value) + 1;
        //    }
        //}
        private static int? getInsertCtrlCode(ApiSerialData data, int adjustType, int factorySource)
        {
            int byteCtrlCode = ConvertToBitInt(data.CtrlCode);
            int byteChangeCode = ConvertToBitInt(data.ChangeCode);
            int byteFactoryCode = ConvertToBitInt(factorySource);

            int maxBitLength = Math.Max(
                Math.Max(GetBitLength(byteCtrlCode), GetBitLength(byteChangeCode)),
                GetBitLength(byteFactoryCode)
            );

            int result = 0;

            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                List<int?> ctrlCode = MESSNDBEntities.vPartMast
                    .Where(s => s.PartNo == data.PartNo)
                    .Select(s => s.CtrlCode)
                    .Distinct()
                    .ToList();

                if (ctrlCode.Count >= 2)
                {
                    throw new Exception("Multiple CtrlCodes found.");
                }

                int bytePartMastCtrlCode = ConvertToBitInt(ctrlCode[0]);

                for (int idx = 0; idx < maxBitLength; idx++)
                {
                    int ctrlBit = (byteCtrlCode >> idx) & 1;
                    int changeBit = (byteChangeCode >> idx) & 1;
                    int partBit = (bytePartMastCtrlCode >> idx) & 1;
                    int factoryBit = (byteFactoryCode >> idx) & 1;

                    int calculatedBit;

                    if (adjustType == 1 && (byteChangeCode & 1) == 1)
                    {
                        calculatedBit = (partBit & ctrlBit) | factoryBit;
                    }
                    else
                    {
                        calculatedBit = (ctrlBit & changeBit) | factoryBit;
                    }
                    result |= (calculatedBit << idx);
                }
            }
            return result;
        }

        private static int? getUpdateCtrlCode(ApiSerialData data, int adjustType, int factorySource)
        {
            int byteCtrlCode = ConvertToBitInt(data.CtrlCode);
            int byteChangeCode = ConvertToBitInt(data.ChangeCode);
            int byteFactoryCode = ConvertToBitInt(factorySource);

            int maxBitLength = Math.Max(
                Math.Max(GetBitLength(byteCtrlCode), GetBitLength(byteChangeCode)),
                GetBitLength(byteFactoryCode)
            );

            int result = 0;

            for (int idx = 0; idx < maxBitLength; idx++)
            {
                int ctrlBit = (byteCtrlCode >> idx) & 1;
                int changeBit = (byteChangeCode >> idx) & 1;
                int partBit = (byteFactoryCode >> idx) & 1;

                int calculatedBit = adjustType == 1 && (byteChangeCode & 1) == 1
                    ? (ctrlBit | changeBit) ^ changeBit | (partBit & changeBit)
                    : (ctrlBit | changeBit) ^ changeBit | (ctrlBit & changeBit);

                result |= (calculatedBit << idx);
            }
            return result;
        }

        private static int GetBitLength(int number)
        {
            if (number == 0) return 1;
            return (int)Math.Floor(Math.Log(number, 2)) + 1;
        }
        private static int ConvertToBitInt(int? number)
        {
            return number.HasValue ? number.Value : 0;
        }
    }
}
