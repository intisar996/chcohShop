namespace onlineShopping.RequestHelpers
{
    public class ServiceResponse : ApiResponse
    {
        public bool Succeed { get; private set; }
        public List<string> Errors { get; set; }

        public ServiceResponse(bool success, int code, string description) : base(code, description)
        {
            Succeed = success;
            Errors = new List<string>();
        }


    }

    public class ServiceResponse<T> : ServiceResponse
    {
        public T Result { get; private set; }

        public ServiceResponse(bool success, T result, int code, string description) : base(success, code, description)
        {
            Result = result;
        }

    }

    public class ServiceResponse<T, R> : ServiceResponse
    {
        public T Result { get; private set; }
        public R Metadata { get; private set; }

        public ServiceResponse(bool success, T result, int code, string description, R metadata) : base(success, code, description)
        {
            Result = result;
            Metadata = metadata;
        }
    }


}
