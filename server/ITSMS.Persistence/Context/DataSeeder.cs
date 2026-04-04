using ITSMS.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace ITSMS.Persistence.Context
{
    public static class DataSeeder
    {
        public static async Task SeedDataAsync(
           UserManager<Employee> userManager,
           RoleManager<Role> roleManager)
        {
            // Seed Roles if not already present
            var roles = new[] { "Admin", "Manager", "AccountUser", "Employee" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new Role { Name = role });
            }

            // Seed Users
            var users = new[]
            {
                new
                {
                    FullName = "Admin",
                    Email    = "admin@gmail.com",
                    UserName = "admin",
                    Password = "Admin@123",
                    Role     = "Admin"
                },
                new
                {
                    FullName = "Manager",
                    Email    = "manager@gmail.com",
                    UserName = "manager",
                    Password = "Manager@123",
                    Role     = "Manager"
                },
                new
                {
                    FullName = "AccountUser",
                    Email    = "accountuser@gmail.com",
                    UserName = "accountuser",
                    Password = "Accountuser@123",
                    Role     = "AccountUser"
                },
                new
                {
                    FullName = "Employee",
                    Email    = "employee@gmail.com",
                    UserName = "employee",
                    Password = "Employee@123",
                    Role     = "Employee"
                },
            };

            foreach (var u in users)
            {
                // Skip if user already exists
                if (await userManager.FindByEmailAsync(u.Email) != null)
                    continue;

                var employee = new Employee
                {
                    FullName = u.FullName,
                    Email = u.Email,
                    NormalizedEmail = u.Email.ToUpper(),
                    UserName = u.UserName,
                    NormalizedUserName = u.UserName.ToUpper(),
                    EmailConfirmed = true,
                };

                var result = await userManager.CreateAsync(employee, u.Password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(employee, u.Role);
                }
                else
                {
                    throw new Exception(
                        $"Failed to seed user '{u.Email}': " +
                        string.Join(", ", result.Errors.Select(e => e.Description))
                    );
                }
            }
        }
    }
}
