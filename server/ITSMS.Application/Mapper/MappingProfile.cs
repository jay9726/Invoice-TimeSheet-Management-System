using AutoMapper;
using ITSMS.Application.DTOs.Client;
using ITSMS.Application.DTOs.Company;
using ITSMS.Application.DTOs.CompanyBankDetail;
using ITSMS.Application.DTOs.Employee;
using ITSMS.Application.DTOs.Project;
using ITSMS.Application.DTOs.TaskActivity;
using ITSMS.Application.DTOs.TimeEntry;
using ITSMS.Domain.Entities;
using ITSMS.Domain.Entities.Identity;


namespace ITSMS.Application.Mappper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CompanyDTO, Company>().ReverseMap();
            CreateMap<GetCompanyDTO, Company>().ReverseMap();
            CreateMap<CompanyDTO, Company>()
            .ForMember(dest => dest.CompanyLogo, opt => opt.MapFrom(src => src.CompanyLogo));
            CreateMap<Company, GetCompanyDTO>();

            CreateMap<ClientDTO, Client>().ReverseMap();
            CreateMap<Client, GetClientDTO>().ReverseMap();
            CreateMap<ProjectDTO, Project>().ReverseMap();
            CreateMap<CreateTaskActivityDTO, TaskActivity>().ReverseMap();
            CreateMap<CompanyBankDetailDTO, CompanyBankDetail>().ReverseMap();
            CreateMap<GetCompanyBankDetailsDTO, CompanyBankDetail>().ReverseMap();
            CreateMap<UpdateEmployeeDTO, Employee>().ReverseMap();

            CreateMap<RawCreateTimeEntryRequestDTO, CreateTimeEntryDTO>().ReverseMap();
        }
    }
}
