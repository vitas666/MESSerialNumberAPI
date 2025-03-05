using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MesSerialNumber.Models.MESSNDB
{
    [Table("PartMast")]
    public partial class PartMast
    {
        public int PartID { get; set; }
        public string PartNo { get; set; }
        public string FactID { get; set; }
        public string PartDesc { get; set; }
        public int SerialType { get; set; }
        public int CtrlCode { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> ModifyDate { get; set; }
    }

    [Table("SctlMast")]
    public partial class SctlMast
    {
        [Key]
        public string ScrmKey { get; set; }
        public string ScrmDesc { get; set; }
        public Nullable<decimal> LastNo { get; set; }
        public Nullable<System.DateTime> LastDateTime { get; set; }
        public Nullable<int> CtrlCode { get; set; }
        public string CtrlString { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> ModifyDate { get; set; }
    }

    [Table("PartCoding")]
    public partial class PartCoding
    {
        [Key]
        public int PartCodingID { set; get; }
        public int PartID { set; get; }
        public string CodingRule { set; get; }
    }
}

namespace MesSerialNumber.Models.CiMESDB
{
    [Table("MES_MMS_MAT")]
    public partial class MES_MMS_MAT
    {
        [Key]
        public string MMS_MAT_SID { set; get; }
        public string MATERIALNO { set; get; }
    }
}