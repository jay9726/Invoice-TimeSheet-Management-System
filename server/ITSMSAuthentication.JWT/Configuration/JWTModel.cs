namespace ITSMS.Authentication.JWT.Configuration
{
    public class JWTModel
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int SessionTimeout { get; set; }
    }
}
