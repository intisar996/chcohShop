using Google.Apis.Auth.OAuth2;
using Google.Apis.Util.Store;
using System.Threading;
using System.Threading.Tasks;
using System;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Auth.OAuth2.Requests;

namespace onlineShopping.Authorization
{






    public class CustomLocalServer : ICodeReceiver
    {
        // تحديد RedirectUri
        public string RedirectUri => "https://localhost:7253/authorize/";

        // هذه الطريقة تتعامل مع استلام الكود التفويضي
        public async Task<AuthorizationCodeResponseUrl> ReceiveCodeAsync(AuthorizationCodeRequestUrl url, CancellationToken taskCancellationToken)
        {
            // تأكد من أن الرابط يحتوي على الكود التفويضي
            var code = ExtractCodeFromUrl(url.ToString()); // استخراج الكود من الرابط
            return await Task.FromResult(new AuthorizationCodeResponseUrl(url.ToString())); // إرجاع الكود
        }

        // هذه الطريقة تساعد في استخراج الكود من الرابط
        private string ExtractCodeFromUrl(string url)
        {
            try
            {
                // تحقق من أن الرابط صالح قبل معالجته
                Uri uri = new Uri(url); // إذا كان الرابط غير صالح، سيؤدي هذا إلى رفع استثناء
                var queryParams = System.Web.HttpUtility.ParseQueryString(uri.Query);
                return queryParams["code"]; // استخرج الكود من الـ URL
            }
            catch (UriFormatException ex)
            {
                // في حالة وقوع استثناء بسبب صيغة URI غير صالحة، يمكنك التعامل مع الخطأ هنا
                Console.WriteLine($"Error parsing URL: {ex.Message}");
                return null; // أو إعادة قيمة بديلة
            }
        }

        // طريقة إضافية لتحليل الكود التفويضي
        public Task<AuthorizationCodeResponseUrl> ParseAuthorizationCodeAsync(string url, CancellationToken taskCancellationToken)
        {
            return Task.FromResult(new AuthorizationCodeResponseUrl(url)); // إرجاع URL الكود
        }
    }
}
