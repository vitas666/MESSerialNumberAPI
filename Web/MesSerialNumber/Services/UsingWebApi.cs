using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace MesSerialNumber.Services
{
    public class UsingWebApi
    {
        private static readonly HttpClient Client = new HttpClient();

        public static async Task<T> JsonPostAsync<T>(string ApiUrl, string ContentType, string JsonData, Dictionary<string, string> Headers = null)
        {
            try
            {
                var content = new StringContent(JsonData, Encoding.UTF8, ContentType);
                var request = new HttpRequestMessage(HttpMethod.Post, ApiUrl)
                {
                    Content = content
                };

                // 加 API Header（如果存在） 
                if (Headers != null)
                {
                    foreach (var header in Headers)
                    {
                        request.Headers.Add(header.Key, header.Value);
                    }
                }
               
                HttpResponseMessage response = await Client.PostAsync(ApiUrl, content);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();
                T dataList = JsonConvert.DeserializeObject<T>(responseBody);
                return dataList;
            }
            catch (HttpRequestException e)
            {
                return default(T);
            }  
        }
    }
}