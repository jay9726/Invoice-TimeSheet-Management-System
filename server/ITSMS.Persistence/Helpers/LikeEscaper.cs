
namespace ITSMS.Persistence.Helpers
{
    public static class LikeEscaper
    {
        /// <summary>
        /// Escapes SQL LIKE special characters so user input is treated as
        /// a literal string. Always call this before wrapping a term in % %.
        /// </summary>
        public static string Escape(string term) =>
            term.Replace("[", "[[]")
                .Replace("%", "[%]")
                .Replace("_", "[_]");
    }
}
