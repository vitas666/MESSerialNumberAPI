using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MESSerialNumberAPI.Models.MESSNDB
{
    [Table("PartMast")]
    public partial class PartMast
    {
        [Key]
        public int PartID { get; set; }
        public string FactID { get; set; }
        public string PartNo { get; set; }
        public string PartDesc { get; set; }
        public Nullable<int> SerialType { get; set; }
        public Nullable<int> CtrlCode { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> ModifyDate { get; set; }
    }
    [Table("SctlMast")]
    public partial class SctlMast
    {
        [Key]
        public string ScrmKey { get; set; }
        public string scrmDesc { get; set; }
        public Nullable<decimal> LastNo { get; set; }
        public Nullable<System.DateTime> LastDateTime { get; set; }
        public Nullable<int> CtrlCode { get; set; }
        public string CtrlString { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> ModifyDate { get; set; }
    }
    [Table("CodeMast")]
    public partial class CodeMast
    {
        [Key]
        public int CodeKey { get; set; }
        public string CodeID { get; set; }
        public string CodeDesc { get; set; }
        public string CodeComment { get; set; }
    }
    [Table("PartCoding")]
    public partial class PartCoding
    {
        [Key]
        public int PartCodingID { set; get; }
        public int PartID { set; get; }
        public string CodingRule { set; get; }
    }
    [Table("SerialData")]
    public partial class SerialData 
    {
        [Key]
        public int SerialID { get; set; }
        public string SerialNo { get; set; }
        public Nullable<int> PartID { get; set; }
        public string InspectionData { get; set; }
        public string PropertyData { get; set; }
        public Nullable<int> CtrlCode { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> ModifyDate { get; set; }
    }
    [Table("SerialHist")]
    public partial class SerialHist
    {
        [Key]
        public int SerialHistID { get; set; }
        public Nullable<int> SerialID { get; set; } = 0;
        public Nullable<int> PartID { get; set; } = 0;
        public string InspectionData { get; set; } = "";
        public string PropertyData { get; set; } = "";
        public Nullable<int> CheckCode { get; set; } = 0;
        public Nullable<int> CtrlCode { get; set; } = 0;
        public string SourceName { get; set; } = "";
        public string UserName { get; set; } = "";
        public Nullable<DateTime> CreatedDate { get; set; } = DateTime.Now;
        public Nullable<DateTime> ModifyDate { get; set; } = DateTime.Now;
    }
    [Table("vPartMast")]
    public partial class vPartMast
    {
        [Key]
        public int PartID { get; set; }
        public string FactID { get; set; }
        public string PartNo { get; set; }
        public string PartDesc { get; set; }
        public Nullable<int> SerialType { get; set; }
        public Nullable<int> CtrlCode { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> ModifyDate { get; set; }
        public Nullable<int> isAutoPass { get; set; }
        public Nullable<int> isAutoPassValue { get; set; }
        public Nullable<int> isFromMESSN { get; set; }
        public Nullable<int> isFromMESSNValue { get; set; }
        public Nullable<int> isFromInspection { get; set; }
        public Nullable<int> isFromInspectionValue { get; set; }
        public Nullable<int> isFromEP { get; set; }
        public Nullable<int> isFromEPValue { get; set; }
        public Nullable<int> isAllowCoding { get; set; }
        public Nullable<int> isAllowCodingValue { get; set; }
    }
    [Table("vSerialData")]
    public partial class vSerialData
    {
        [Key]
        public int SerialID { get; set; }
        public string SerialNo { get; set; }
        public Nullable<int> PartID { get; set; }
        public string InspectionData { get; set; }
        public string PropertyData { get; set; }
        public Nullable<int> CtrlCode { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> ModifyDate { get; set; }
        public string FactID { get; set; }
        public string PartNo { get; set; }
        public string PartDesc { get; set; }
        public Nullable<int> SerialType { get; set; }
        public Nullable<int> PartCtrlCode { get; set; }
    }
    [Table("vPartCoding")]
    public partial class vPartCoding
    {
        [Key]
        public int PartCodingID { get; set; }
        public Nullable<int> PartID { get; set; }
        public string FactID { get; set; }
        public string PartNo { get; set; }
        public string PartDesc { get; set; }
        public Nullable<int> SerialType { get; set; }
        public string CodingRule { get; set; }
        public Nullable<int> CtrlCode { get; set; }
        public Nullable<int> PartCtrlCode { get; set; }
    }
}

namespace MESSerialNumberAPI.Models.CiMESDB
{
    [Table("vSerialCustPartNo")]
    public partial class vSerialCustPartNo
    {
        [Key]
        public string SerialNo { get; set; }
        public string OrderNo { get; set; }
        public string SONo { get; set; }
        public string SOItem { get; set; }
        public string CustID { get; set; }
        public string CustPartNo { get; set; }
    }

    [Table("IF_WO_BOM")]
    public partial class IF_WO_BOM
    {
        [Key]
        public string SID { set; get; }
        public string MATNR { set; get; }
        public string AUFNR { set; get; }
    }

    [Table("MES_MMS_MAT")]
    public partial class MES_MMS_MAT
    {
        [Key]
        public string MMS_MAT_SID { set; get; }
        public string MATERIALNO { set; get; }
    }
}