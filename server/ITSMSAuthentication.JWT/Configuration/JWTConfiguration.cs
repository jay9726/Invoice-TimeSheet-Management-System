using Microsoft.Extensions.Configuration;

namespace ITSMS.Authentication.JWT.Configuration
{
    public static class JWTConfiguration
    {      
        public static JWTModel GetJWTConfiguration(IConfiguration configuration)
        {
            var issuer = configuration["JWT:Issuer"];
            var audience = configuration["JWT:Audience"];
            var key = configuration["JWT:key"];
            var sessionTimeout = configuration["JWT:SessionTimeout"];


            if (string.IsNullOrWhiteSpace(issuer))
                throw new InvalidOperationException("JWT configuration is missing: 'JWT:Issuer'");

            if (string.IsNullOrWhiteSpace(audience))
                throw new InvalidOperationException("JWT configuration is missing: 'JWT:Audience'");

            if (string.IsNullOrWhiteSpace(key))
                throw new InvalidOperationException("JWT configuration is missing: 'JWT:key'");

            if (!int.TryParse(sessionTimeout, out var timeout))
                throw new InvalidOperationException("JWT configuration is invalid: 'JWT:SessionTimeout' must be a valid integer");

            return new JWTModel
            {
                Issuer = issuer,
                Audience = audience,
                Key = key,
                SessionTimeout = timeout
            };
        }
    }
}
