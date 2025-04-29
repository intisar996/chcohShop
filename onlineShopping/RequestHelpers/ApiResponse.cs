using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace onlineShopping.RequestHelpers
{
    public class ApiResponse
    {
        public bool Success { get; private set; }

        public int Code { get; private set; }

        public string Description { get; private set; }

        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]

        public object Data { get; private set; }

        public ApiResponse(int code, string description)
        {
            Success = code >= 2000 && code <= 2999 ? true : false;
            Code = code;
            Description = description;
        }


        public ApiResponse(int code, string description, object data) : this(code, description)
        {
            Data = data;
        }
        public ApiResponse(int code, string description, object data, object metadata) : this(code, description)
        {
            Data = data;
        }

    }
}
