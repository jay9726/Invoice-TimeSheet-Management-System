namespace ITSMS.API.helper
{
    public class UploadImage
    {
        private static readonly string[] AllowedExt = [".jpg", ".jpeg", ".png", ".webp"];


        private static readonly Dictionary<string, byte[][]> MagicBytes = new()
        {
            [".jpg"] = [[0xFF, 0xD8, 0xFF]],
            [".jpeg"] = [[0xFF, 0xD8, 0xFF]],
            [".png"] = [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
            [".webp"] = [[0x52, 0x49, 0x46, 0x46]],
        };

        public static async Task<string?> SaveCompanyLogoAsync(IFormFile? file)
        {
            if (file == null || file.Length == 0) return null;

            var rawExt = Path.GetExtension(file.FileName);

            if (string.IsNullOrEmpty(rawExt) || !rawExt[1..].All(char.IsLetter))
                throw new Exception("Invalid file extension.");

            var ext = rawExt.ToLowerInvariant();

            if (!AllowedExt.Contains(ext))
                throw new Exception("Only jpg, jpeg, png, webp files are allowed.");

            if (file.Length > 2 * 1024 * 1024)
                throw new Exception("Max file size is 2 MB.");

            await ValidateMagicBytesAsync(file, ext);

            var folder = Path.Combine("wwwroot", "uploads", "companies");
            Directory.CreateDirectory(folder);

            var fileName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(folder, fileName);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/uploads/companies/{fileName}";
        }



        private static async Task ValidateMagicBytesAsync(IFormFile file, string ext)
        {
            if (!MagicBytes.TryGetValue(ext, out var signatures))
                throw new Exception("Cannot validate file type.");


            var header = new byte[8];
            await using var stream = file.OpenReadStream();
            var bytesRead = await stream.ReadAsync(header.AsMemory(0, header.Length));

            bool matched = signatures.Any(sig =>
                bytesRead >= sig.Length &&
                header.Take(sig.Length).SequenceEqual(sig));

            if (!matched)
                throw new Exception("File content does not match the declared image type.");
        }


    }
}
