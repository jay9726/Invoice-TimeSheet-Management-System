
namespace ITSMS.Application.DTOs.API_Response
{
    public class APIResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public int? Count { get; set; }

        public static APIResponse<T> Ok(T data, string message = "Success", int? count = null) =>
            new() { Success = true, Message = message, Data = data, Count = count };

        public static APIResponse<T> Fail(string message) =>
            new() { Success = false, Message = message, Data = default, Count = null };
    }
}
