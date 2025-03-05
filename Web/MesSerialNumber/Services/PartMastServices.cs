using MesSerialNumber.Constant;
using MesSerialNumber.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MesSerialNumber.Services
{
    public class PartMastServices
    {
        public static string GetPartDesc(string PartNo)
        {
            string result = String.Empty;
            using (var CiMESDBEntities = new CiMESDBEntities())
            {
                result = CiMESDBEntities.MES_MMS_MAT.Where(p => p.MATERIALNO == PartNo).Select(p => p.SPEC).FirstOrDefault();
            }
            return result;
        }

        public static string CheckPartNo(string PartNo)
        {
            string result = Common.FAIL;
            using (var CiMESDBEntities = new CiMESDBEntities())
            {
                if (CiMESDBEntities.MES_MMS_MAT.Where(p => p.MATERIALNO == PartNo).Any())
                {
                    result = Common.SUCCESS;
                }
            }
            return result;
        }

        public static string CheckPartNoRepeat(string PartNo)
        {
            string result = Common.SUCCESS;
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                if (MESSNDBEntities.PartMast.Where(p => p.PartNo == PartNo).Any())
                {
                    result = Common.FAIL;
                }
            }
            return result;
        }

        public static string CheckPartCoding(string CodingRule)
        {
            string result = Common.SUCCESS;
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                if (MESSNDBEntities.vPartCoding.Where(p => p.CodingRule == CodingRule).Any())
                {
                    result = Common.FAIL;
                }
            }
            return result;
        }

        public static List<string> CheckCodingVaild(int PartID)
        {
            List<string> result = new List<string>();
            using (var MESSNDBEntities = new MESSNDBEntities())
            {
                List<vPartCoding> vPartCodingList = MESSNDBEntities.vPartCoding.ToList();
                List<PartCoding> partCodingList = MESSNDBEntities.PartCoding.Where(p => p.PartID == PartID).ToList();
                List<PartMast> partMastList = MESSNDBEntities.PartMast.ToList();

                if (partCodingList.Any())
                {
                    partCodingList.ForEach(x => {
                        if (vPartCodingList.Where(p => p.CodingRule == x.CodingRule).Any())
                        {
                            string partNo = partMastList.Where(p => p.PartID == x.PartID).Select(p => p.PartNo).FirstOrDefault();
                            result.Add(partNo);
                        }
                    });
                }
            }
            return result;
        }
    }
}