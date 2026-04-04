//using ITSMS.Authentication.JWT.Configuration;
//using Microsoft.Extensions.Configuration;
//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//namespace ITSMS.Authentication.JWT.Services
//{
//    public class AuthorizationService : IAuthorizationService
//    {
//        private readonly IConfiguration _configuration;
//        public AuthorizationService(IConfiguration configuration) 
//        {
//            _configuration = configuration;
//        }
//        public string GenerateJwtToken(string role)
//        {
//            var jwtModel = JWTConfiguration.GetJWTConfiguration(_configuration);
//            var claims = new List<Claim> { new Claim(ClaimTypes.Role, role) };

//            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtModel.Key));
//            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

//            var token = new JwtSecurityToken(jwtModel.Issuer, jwtModel.Audience,
//                claims: claims,
//              expires: DateTime.Now.AddMinutes(jwtModel.SessionTimeout),
//              signingCredentials: credentials);

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//    }
//}










//  Generate Token using email, employeeId and role

using ITSMS.Authentication.JWT.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ITSMS.Authentication.JWT.Services
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly IConfiguration _configuration;

        public JwtTokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string GenerateJwtToken(string email, string employeeId, string role)
        {
            var jwtModel = JWTConfiguration.GetJWTConfiguration(_configuration);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, role),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.NameIdentifier, employeeId)
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtModel.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtModel.Issuer,
                audience: jwtModel.Audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(jwtModel.SessionTimeout),
                signingCredentials: credentials
        );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
