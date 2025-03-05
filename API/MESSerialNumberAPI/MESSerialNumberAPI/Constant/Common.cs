namespace MESSerialNumberAPI.Constant
{
    public class Common
    {
        public const string APP_SETTINGS_KEY_TEST_URL_AUTHORITY = "TestURLAuthority";

        public const char COMMA = ',';
        public const char HASHTAG = '#';
        public const char DOLLAR = '$';
        public const char PARENT = '%';

        public const string UPDATEDATETIME = "UPDATEDATETIME";
        public const string Y = "Y";
        public const string N = "N";
        public const string MESSAGE_CODE = "MESSAGE_CODE";
        public const string SUCCESS = "SUCCESS";
        public const string FAIL = "FAIL";
        public const string Exception = "Exception";
        public const string DESH = "-";
        public const string TRIPLE_DESH = "---";
        public const string POST = "POST";
        public const string GET = "GET";
        public const string PUT = "PUT";
        public const string APP_JSON = "application/json";
        public const string CIMESDB = "CiMESDB";
        public const string MESSNDB = "MESSNDB";
        public const string SCRM_KEY_SERIAL_HIST = "TBKEY_SerialHist@MES";
        public const string SCRM_KEY_SERIAL_MAST = "TBKEY_SerialMast@MES";
        public const string MODIFY = "modify";
        public const string CREATE = "create";
        public const int batchSize = 20;
        public const int SNPLATFORM = 128;
        public const int ELECTRONINSPECTIONCENTER = 256;
        public const int EP = 512;
        public const int PRODUCTIONLINE = 1024;
        public const string UPLOADSERIALDATABYSNPLATFORM = "UploadSerialDataBySNPlatform";
        public const string MODIFYSERIALDATABYSNPLATFORM = "ModifySerialDataBySNPlatform";
        public const string UPLOADSERIALDATABYELECTRONINSPECTIONCENTER = "UploadSerialDataByElectronInspectionCenter";
        public const string MODIFYSERIALDATABYELECTRONINSPECTIONCENTER = "ModifySerialDataByElectronInspectionCenter";
        public const string UPLOADSERIALDATABYEP = "UploadSerialDataByEP";
        public const string MODIFYSERIALDATABYEP = "ModifySerialDataByEP";
        public const string UPLOADSERIALDATABYPRODUCTIONLINE = "UploadSerialDataByProductionLine";
        public const string MODIFYSERIALDATABYPRODUCTIONLINE = "ModifySerialDataByProductionLine";
        public const string EMPTY_SERIALNO = "SerialNo is empty";
        public const string EMPTY_PARTNO = "PartNo is empty";
        public const string PARTNO_NOT_EXIST = "PartNo does not exist";
        public const string DUPLICATE_PARTNO = "Duplicate PartNo detected";
        public const string DUPLICATE_SERIALNO = "Duplicate SerialNo detected";
        public const string INCORRECT_INSPECTION_DATA = "Incorrect Json format in Inspection data ";
        public const string INCORRECT_PROPERTY_DATA = "Incorrect Json format in Property data ";
        public const string SERIALNO_NOT_EXIST = "SerialNo does not exist";
        public const string SERIALNO_MULTIPLE_MATCH = "Multiple entries match SerialNo Data";
        public const string EMPTY_SERIALNO_DATA = "SerialNo Data is empty";


    }

    public enum AdjustTypeEnum
    {
        Upload = 1,
        Modify = 2,
    }

    public enum CheckCodeEnum 
    {
        Checked = 1,
        UnChecked = 0,
    }

    public enum UploadSourceEnum
    {
        SNPlatform = 128,
        ElectronInspectionCenter = 256,
        EP = 512,
        ProductionLine = 1024,
    }

    public enum LogicalEnum
    {
        ExistSerialNo = 1,
        ComplyCoding = 2,
    }

    public enum ValidEnum
    {
        Qualified = 1,
        ExistMoBom = 2,
        BurningCorrectly = 4,
        WosMatnrY = 8,
    }
}
