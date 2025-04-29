
using onlineShopping.RequestHelpers;

namespace onlineShopping.RequestHelpers.MessageHandler
{
    public class MessageHandler : IMessageHandler
    {
        // Define you error message here based on your error code
        public string GetMessage(ErrorMessage code, string extraMessage = "")
        {
            return code switch
            {
                ErrorMessage.InvalidInput => GetFormat("Validation error", extraMessage),
                ErrorMessage.BadRequest => "Invalid information",

                ErrorMessage.Unauthorized => "Invalid username or password",

                ErrorMessage.NotFound => GetFormat("{0} not found", extraMessage),

                ErrorMessage.Forbidden => "Access denied",

                ErrorMessage.AlreadyExists => GetFormat("{0} already exists", extraMessage),

                ErrorMessage.WrongPassword => "Couldn't change password",

                ErrorMessage.UnableToAdd => GetFormat("Unable to add {0}", extraMessage),

                ErrorMessage.UnableToUpdate => GetFormat("Unable to update {0}", extraMessage),

                ErrorMessage.UnableToRetrieve => GetFormat("Unable to retrieve {0}", extraMessage),

                ErrorMessage.UnableToDelete => GetFormat("Unable to delete {0}", extraMessage),

                ErrorMessage.MoreRolesSubmitted => "Too many roles submitted",

                ErrorMessage.RolesNotBelongToBusinessGroup => "Roles does not exists for your business group",

                ErrorMessage.InValidPermissions => "Permissions sent are invalid",

                ErrorMessage.UserAlreadyLoggedIn => "Already loggedin",

                ErrorMessage.UnableToRegisterUser => GetFormat("Unable to register user with email {0}", extraMessage),

                ErrorMessage.UnVerifiedUserLogin => "You need to confirm your account. We have sent you an activation code, please check your email",

                ErrorMessage.VerificationTokenPassed30Min => "Verification token passed 30 min",

                ErrorMessage.InValidImageFormat => "Invalid image file format",

                ErrorMessage.SuperAdminNotRegistered => "Super Admin Not Registered",

                ErrorMessage.EmailwithoutThawaniDomain => "Email without Thawani Domain",

                ErrorMessage.AlreadyRefunded => "Transaction Already Refunded",

                ErrorMessage.PaymentRejectedByGateway => "Payment Rejected By Gateway",

                ErrorMessage.InvalidProcessType => "Invalid Process Type",

                ErrorMessage.Inactive => "Inactive",

                ErrorMessage.WalletBalanceNotAvailable => "Insufficient Wallet balance to Refund",

                ErrorMessage.ExceededRefundLimitDate => "Exceeded Refund Limit Date",

                ErrorMessage.UnableToParse => GetFormat("Unable to parse {0}", extraMessage),

                ErrorMessage.PaymentInquiryFailed => "Payment Inquiry Failed",

                ErrorMessage.RefundFailed => "Refund Failed",

                ErrorMessage.VoidFailed => "Void Failed",

                ErrorMessage.DateIsInvalid => GetFormat("{0} Is Invaild ", extraMessage),

                ErrorMessage.DateExpired => GetFormat("{0} Date Expired", extraMessage),

                ErrorMessage.UserKycDoneforExistingNationalId => "NationalId cannot be modified as Kyc is already done",

                ErrorMessage.ExceededRefundAmount => "Refund Amount Exceeds Original Transaction Amount",

                ErrorMessage.InvalidResetDate => "Invalid Reset Date",

                ErrorMessage.UserIsNotKycd => "User Is Not Kyced",

                ErrorMessage.MojabCardAlreadyExist => "Mojab Card Already Exist",

                ErrorMessage.BankDhofarRespondedWithFailure => "BankDhofar Responded With Failure",

                ErrorMessage.MojabOnBoardingFailed => "Mojab OnBoarding Failed",

                ErrorMessage.BankDhofarLimitExceedsWithRefundAmount => "Bank Dhofar Limit Exceeds when added the RefundAmount",

                ErrorMessage.Required => GetFormat("{0} is Required", extraMessage),

                ErrorMessage.DeleteUserBalanceGreaterThanZero => "Delete User Balance Greater Than Zero",

                ErrorMessage.AlreadySettledTransaction => "Already Settled Transaction",

                ErrorMessage.NationalIdDoesNotMatch => "National Id Does Not Match",

                ErrorMessage.Failed => GetFormat("{0} Failed", extraMessage),

                ErrorMessage.UserDoesNotBelongToSelectedRole => "User Does Not Belong To Selected Role",

                ErrorMessage.UserNotRegistered => GetFormat("User Not Registered {0}", extraMessage),

                ErrorMessage.CheckerCannotInitiateRequest => "Checker Cannot Initiate Request",

                ErrorMessage.ValidFromIsGreater => "ValidFrom Is Greater Than ValidTo",

                ErrorMessage.DiscountGreaterThan100 => "Discount Percentage Greater Than 100",

                ErrorMessage.ServerInternalError => GetFormat("There is an Error happend during proccesing the request {0}", extraMessage),

                ErrorMessage.AlreadyAtharActivated => GetFormat("{0} Already Athar Activated", extraMessage),
                ErrorMessage.NotActive => GetFormat("{0} is not active", extraMessage),
                ErrorMessage.GenericError => GetFormat("{0}", extraMessage),
                ErrorMessage.UserUnderAge => GetFormat("{0}", extraMessage),
                ErrorMessage.SenderExpiryDate => GetFormat("{0}", extraMessage),
                ErrorMessage.MojabTopupNotActive => GetFormat("{0}", extraMessage),
                ErrorMessage.ProviderRespondedWithFailure => GetFormat("{0}", extraMessage),
                ErrorMessage.ExceedPersonalCardsLimit => GetFormat("{0}", extraMessage),
                ErrorMessage.HpsEndpointError => GetFormat("{0}", extraMessage),

                _ => throw new ArgumentOutOfRangeException(nameof(code), code, null),

            };
        }

        // Define your success here based on your success code
        public string GetMessage(SuccessMessage code, string extraMessage = "")
        {
            return code switch
            {
                SuccessMessage.Retrieved => GetFormat("{0} retrieved successfully", extraMessage),

                SuccessMessage.Created => GetFormat("{0} added successfully", extraMessage),

                SuccessMessage.Updated => GetFormat("{0} updated successfully", extraMessage),

                SuccessMessage.Deleted => GetFormat("{0} deleted successfully", extraMessage),

                SuccessMessage.Generated => GetFormat("{0} generated successfully", extraMessage),

                SuccessMessage.UserSuccessfullyLoggedIn => "Loggedin successfully",

                SuccessMessage.UserSuccessfullyRegistered => "User registered successully",

                SuccessMessage.PasswordChangedSuccessfully => "Password changed successfully",

                SuccessMessage.UserSuccesffulyLoggedOut => "User loggedout succesffuly",

                SuccessMessage.UserPassedVerification => "User passed verification",

                SuccessMessage.ValidImageFormat => "Image sent is valid",

                SuccessMessage.Approved => GetFormat("{0} Approved successfully", extraMessage),

                SuccessMessage.Rejected => GetFormat("{0} Rejected successfully", extraMessage),

                SuccessMessage.AtharActivated => GetFormat("{0} Athar Activated", extraMessage),

                SuccessMessage.Pushed => GetFormat("{0} added to queue successfully for processing, You will receive email once done", extraMessage),

                SuccessMessage.WalletTopUpSuccessfully => GetFormat("{0} added to queue successfully for processing, You will receive email once done", extraMessage),
                SuccessMessage.GenericSuccessMessage => GetFormat("{0}", extraMessage),
                _ => throw new ArgumentOutOfRangeException(nameof(code), code, null),
            };
        }

        public string GetFormat(string message, string extraMessage)
        {
            return string.Format(message, extraMessage);
        }
        public ServiceResponse<T> GetServiceResponse<T>(ErrorMessage errorMessage, T result, string notes = null)
        {
            return new ServiceResponse<T>(
                success: false,
                result: result,
                code: (int)errorMessage,
                description: GetMessage(errorMessage, notes));
        }
        public ServiceResponse GetServiceResponse(ErrorMessage errorMessage, string note = null)
        {
            return new ServiceResponse(
                success: false,
                code: (int)errorMessage,
                description: GetMessage(errorMessage, note));
        }
        public ServiceResponse GetServiceResponse(SuccessMessage successMessage, string note = null)
        {
            return new ServiceResponse(
                success: true,
                code: (int)successMessage,
                description: GetMessage(successMessage, note));
        }
        public ServiceResponse<T> GetServiceResponse<T>(SuccessMessage successMessage, T result, string note = null)
        {
            return new ServiceResponse<T>(
                success: true,
                result: result,
                code: (int)successMessage,
                description: GetMessage(successMessage, note));
        }
    }

}
