using MesSerialNumber.Constant;
using MesSerialNumber.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MesSerialNumber.Services
{
    public class UploadServices
    {
        public static Encoding DetectEncoding(Stream CsvStream)
        {
            byte[] bom = new byte[4];
            CsvStream.Read(bom, 0, 4);
            CsvStream.Seek(0, SeekOrigin.Begin);

            if (bom[0] == 0xef && bom[1] == 0xbb && bom[2] == 0xbf)
                return Encoding.UTF8;
            if (bom[0] == 0xff && bom[1] == 0xfe)
                return Encoding.Unicode;
            if (bom[0] == 0xfe && bom[1] == 0xff)
                return Encoding.BigEndianUnicode;
            return Encoding.Default;
        }
        public static async Task<SerialDataResult> ProcessCsv(Stream CsvStream)
        {
            List<APISerialData> apiSerialDataList = new List<APISerialData>();
            List<string[]> csvRows = new List<string[]>();

            using (StreamReader sr = new StreamReader(CsvStream, DetectEncoding(CsvStream)))
            {
                string line;
                while ((line = sr.ReadLine()) != null)
                {
                    string[] lineArray = line.Split(',');
                    lineArray = lineArray.Select(p => string.IsNullOrEmpty(p) ? null : p).ToArray();
                    if (lineArray.Length > 0) csvRows.Add(lineArray);
                }
            }
            
            try {
                string[] title = csvRows[0];
                csvRows.RemoveAt(0);
                csvRows.ForEach(x =>
                {
                    if (!string.IsNullOrEmpty(x[0]) && !string.IsNullOrEmpty(x[1]))
                    {
                        APISerialData data = new APISerialData
                        {
                            SerialNo = x[0],
                            PartNo = x[1],
                            CtrlCode = int.Parse(x[2]),
                            InspectionData = GetJsonData(title, x, 3, x.Length)
                        };
                        apiSerialDataList.Add(data);
                    }
                });
            }
            catch(Exception e)
            {
                return new SerialDataResult {
                    IncorrectData = new List<APISerialData> {
                        new APISerialData {
                            Message = e.ToString()
                        }
                    }
                };
            }

            string apiUrl = Common.API_DOMAIN_URL + Common.API_UPLOAD_URL;
            Dictionary<string, List<APISerialData>> jsonDict = new Dictionary<string, List<APISerialData>>();
            jsonDict["SerialDataList"] = apiSerialDataList;
            string jsonData = JsonConvert.SerializeObject(jsonDict);
            return await UsingWebApi.JsonPostAsync<SerialDataResult>(apiUrl, Common.APP_JSON, jsonData);
        }
        private static string GetJsonData(string[] Title, string[] Row, int StartCol, int EndCol)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            for (int col = StartCol; col < EndCol; col++)
            {
                dict[Title[col]] = Row[col];
            }
            return JsonConvert.SerializeObject(dict);
        }
    }
}