namespace onlineShopping.RequestHelpers.MessageHandler
{
    public interface IMessageHandler
    {


        string GetMessage(ErrorMessage code, string extraMessage = "");

        string GetMessage(SuccessMessage code, string extraMessage = "");


        ServiceResponse GetServiceResponse(SuccessMessage successMessage, string note = null);
        ServiceResponse<T> GetServiceResponse<T>(SuccessMessage successMessage,T result, string note = null);

        ServiceResponse<T> GetServiceResponse<T>(ErrorMessage errorMessage, T result, string notes = null);
        ServiceResponse GetServiceResponse(ErrorMessage errorMessage, string note = null);

    }


    public enum ErrorMessage
    {

        InvalidInput = 1000,




        BadRequest = 4000,
        Unauthorized = 4001,
        Forbidden = 4003,
        NotFound = 4004,
        AlreadyExists = 4005,

        WrongPassword = 4006,

        UnableToAdd = 4007,
        UnableToUpdate = 4008,
        UnableToRetrieve = 4009,
        UnableToDelete = 4010,

        MoreRolesSubmitted = 4011,
        RolesNotBelongToBusinessGroup = 4012,
        InValidPermissions = 4013,

        UserAlreadyLoggedIn = 4014,
        UnableToRegisterUser = 4015,
        UnVerifiedUserLogin = 4016,
        VerificationTokenPassed30Min = 4017,
        InValidImageFormat = 4018,
        SuperAdminNotRegistered = 4019,
        EmailwithoutThawaniDomain = 4029,
        AlreadyRefunded = 4030,
        PaymentRejectedByGateway = 4031,
        InvalidProcessType = 4032,
        Inactive = 4033,
        WalletBalanceNotAvailable = 4034,
        ExceededRefundLimitDate = 4035,
        UnableToParse = 4036,
        PaymentInquiryFailed = 4037,
        RefundFailed = 4038,
        VoidFailed = 4039,
        DateIsInvalid = 4040,
        DateExpired = 4041,
        UserKycDoneforExistingNationalId = 4042,
        ExceededRefundAmount = 4043,
        InvalidResetDate = 4044,
        UserIsNotKycd = 4045,
        MojabCardAlreadyExist = 4046,
        BankDhofarRespondedWithFailure = 4047,
        MojabOnBoardingFailed = 4048,
        BankDhofarLimitExceedsWithRefundAmount = 4049,
        Required = 4050,
        DeleteUserBalanceGreaterThanZero = 4051,
        AlreadySettledTransaction = 4052,
        NationalIdDoesNotMatch = 4053,
        Failed = 4054,
        UserDoesNotBelongToSelectedRole = 4055,
        UserNotRegistered = 4066,
        CheckerCannotInitiateRequest = 4067,
        ValidFromIsGreater = 4068,
        DiscountGreaterThan100 = 4069,
        AlreadyAtharActivated = 4070,
        GenericError = 4071,

        UserUnderAge = 4217,

        SenderExpiryDate = 4708,

        MojabTopupNotActive = 4807,
        ProviderRespondedWithFailure = 4811,
        ExceedPersonalCardsLimit = 4816,


        ServerInternalError = 5000,
        NotActive = 5100,
        HpsEndpointError = 5002,


    }



    public enum SuccessMessage
    {
        Retrieved = 2000,
        Created = 2001,
        Updated = 2002,
        Deleted = 2003,
        Generated = 2004,

        UserSuccessfullyLoggedIn = 2005,
        UserSuccessfullyRegistered = 2006,
        PasswordChangedSuccessfully = 2007,
        UserSuccesffulyLoggedOut = 2008,
        UserPassedVerification = 2009,
        ValidImageFormat = 2010,
        Approved = 2011,
        Rejected = 2012,
        AtharActivated = 2013,
        Pushed = 2015,

        WalletTopUpSuccessfully = 2400,
        GenericSuccessMessage = 2401,


    }


}
