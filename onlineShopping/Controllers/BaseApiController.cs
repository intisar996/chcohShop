using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using onlineShopping.RequestHelpers;
using onlineShopping.RequestHelpers.MessageHandler;

namespace onlineShopping.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        private readonly IMessageHandler _messageHandler;
        private readonly IHttpContextAccessor _contextAccessor;

        public BaseApiController(IMessageHandler messageHandler, IHttpContextAccessor contextAccessor)
        {
            _messageHandler = messageHandler;
            _contextAccessor = contextAccessor;
        }

        [NonAction]
        public ActionResult GetServiceResponse<T>(ServiceResponse<T> response)
        {
            if (!response.Succeed)
            {
                return BadRequest(new ApiResponse(response.Code, response.Description, response.Result));
            }

            return Ok(new ApiResponse(response.Code, response.Description, response.Result));
        }

        [NonAction]
        public ActionResult GetServiceResponse(ServiceResponse response)
        {
            var apiResponse = new ApiResponse(response.Code, response.Description);
            return response.Succeed ? Ok(apiResponse) : BadRequest(apiResponse);
        }

    }
}
