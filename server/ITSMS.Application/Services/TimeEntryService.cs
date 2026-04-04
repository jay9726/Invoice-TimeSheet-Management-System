using AutoMapper;
using ITSMS.Application.DTOs.API_Response;
using ITSMS.Application.DTOs.TimeEntry;
using ITSMS.Application.ICommon;
using ITSMS.Application.IServices;
using ITSMS.Domain.Entities;
using ITSMS.Domain.Enum;

namespace ITSMS.Application.Services
{
    public class TimeEntryService : ITimeEntryService
    {
        public readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;


        public TimeEntryService(IUnitOfWork unitOfWork,IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves a single time entry by its associated task ID, including client name,
        /// project name, task name, work date, hours worked, and billability status.
        /// </summary>
        /// <param name="taskId"></param>
        /// <returns></returns>
        public async Task<APIResponse<TimeEntryResponseDTO>> GetTimeEntryByTaskId(Guid taskId)
        {
            if (taskId == Guid.Empty)
                return APIResponse<TimeEntryResponseDTO>.Fail("Invalid task ID");

            var timeEntry = await _unitOfWork.TimeEntryRepository.GetTimeEntryByTaskIdAsync(taskId);
            if (timeEntry == null)
                return APIResponse<TimeEntryResponseDTO>.Fail("Time entry not found");

            var result = new TimeEntryResponseDTO
            {
                TimeEntryId = timeEntry.TimeEntryId.ToString(),
                TimesheetId = timeEntry.TimesheetId.ToString(),
                ClientName = timeEntry.Clients.ClientName,
                ProjectName = timeEntry.Projects.ProjectName,
                StartTime = timeEntry.StartTime.ToString(),
                EndTime = timeEntry.EndTime.ToString(),
                TaskName = timeEntry.TaskActivities.TaskName,
                WorkDate = timeEntry.WorkDate,
                HoursWorked = timeEntry.HoursWorked.ToString(),
                IsBillable = timeEntry.IsBillable,
                Notes = timeEntry.Notes
            };

            return APIResponse<TimeEntryResponseDTO>.Ok(result, "Time entry fetched successfully");
        }

        /// <summary>
        /// Creates a new time entry for a given user on a specified work date.
        /// If no timesheet exists for the user on that date, a new <see cref="TimeSheetStatus.DRAFT"/>
        /// timesheet is automatically created and saved before the entry is added.
        /// Adding entries to a timesheet with a <see cref="TimeSheetStatus.SUBMITTED"/> or
        /// <see cref="TimeSheetStatus.APPROVED"/> status is not permitted.
        /// A new <see cref="TaskActivity"/> is also created and linked to the time entry.
        /// Note: client name, project name, and task name are not included in the returned DTO
        /// as navigation properties are not loaded after creation.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="req"></param>
        /// <returns></returns>

        public async Task<APIResponse<TimeEntryResponseDTO>> CreateAsync(Guid userId, List<RawCreateTimeEntryRequestDTO> requestDTO)
        {
            if (userId == Guid.Empty || requestDTO == null)
                return APIResponse<TimeEntryResponseDTO>.Fail("Invalid request data");

            var request = _mapper.Map<List<CreateTimeEntryDTO>>(requestDTO);

            foreach (var req in request)
            {

                var sheet = await _unitOfWork.TimesheetRepository.CheckandGetTimeSheetByUserAndDateAsync(userId, req.WorkDate);

                if (sheet == null)
                {
                    sheet = new TimeSheet
                    {
                        UserId = userId,
                        WeekStartDate = req.WorkDate,
                        Status = TimeSheetStatus.DRAFT
                    };
                    await _unitOfWork.TimesheetRepository.AddTimeSheetAsync(sheet);
                    //await _unitOfWork.TimesheetRepository.SaveChangesAsync();

                }

                if (sheet.Status == TimeSheetStatus.SUBMITTED || sheet.Status == TimeSheetStatus.APPROVED)
                    return APIResponse<TimeEntryResponseDTO>.Fail("Cannot add entries to a submitted or approved timesheet");

                var taskModal = new TaskActivity
                {
                    TaskName = req.TaskActivityName,
                    IsBillableDefault = req.IsBillable
                };

                var addTask = await _unitOfWork.TaskActivityRepository.CreateTaskActivityAsync(taskModal);

                var entry = new TimeEntry
                {
                    TimesheetId = sheet.TimesheetId,
                    WorkDate = sheet.WeekStartDate,
                    ClientId = Guid.Parse(req.ClientId),
                    ProjectId = Guid.Parse(req.ProjectId),
                    TaskId = addTask.TaskActivityId,
                    StartTime = req.StartTime,
                    EndTime = req.EndTime,
                    HoursWorked = req.HoursWorked,
                    IsBillable = req.IsBillable,
                    Notes = req.Notes
                };

                await _unitOfWork.TimeEntryRepository.AddAsync(entry);
                //await _unitOfWork.TimeEntryRepository.SaveChangesAsync();
                await _unitOfWork.Save();
            }
            //var result = new TimeEntryResponseDTO
            //{
            //    TimeEntryId = entry.TimeEntryId.ToString(),
            //    TimesheetId = entry.TimesheetId.ToString(),
            //    WorkDate = entry.WorkDate,
            //    HoursWorked = entry.HoursWorked.ToString(),
            //    IsBillable = entry.IsBillable,
            //    Notes = entry.Notes
            //};

            return APIResponse<TimeEntryResponseDTO>.Ok(null,"Time entry created successfully");
        }


        /// <summary>
        /// Updates an existing time entry and its associated task activity with the data provided in the DTO.
        /// Validates and parses the client ID and project ID string values from the DTO before applying changes.
        /// Both the time entry fields and the linked <see cref="TaskActivity"/> name and billability are updated.
        /// Project name and task name in the returned DTO are populated only if the navigation properties
        /// are available on the updated entity.
        /// </summary>
        /// <param name="dto"></param>
        /// <param name="timeentryId"></param>
        /// <returns></returns>

        public async Task<APIResponse<TimeEntryResponseDTO>> UpdateTimeEntryAsync(CreateTimeEntryDTO dto, Guid timeentryId)
        {
            if (timeentryId == Guid.Empty || dto == null)
                return APIResponse<TimeEntryResponseDTO>.Fail("Invalid request data");

            var findTimeEntry = await _unitOfWork.TimeEntryRepository.GetTimeEntryByTaskIdAsync(timeentryId);
            if (findTimeEntry == null)
                return APIResponse<TimeEntryResponseDTO>.Fail("Time entry not found");


            if (!Guid.TryParse(dto.ClientId, out Guid ClientId))
                return APIResponse<TimeEntryResponseDTO>.Fail("Invalid client ID");

            if (!Guid.TryParse(dto.ProjectId, out Guid ProjectId))
                return APIResponse<TimeEntryResponseDTO>.Fail("Invalid project ID");

            findTimeEntry.WorkDate = dto.WorkDate;
            findTimeEntry.ClientId = ClientId;
            findTimeEntry.ProjectId = ProjectId;
            findTimeEntry.StartTime = dto.StartTime;
            findTimeEntry.EndTime = dto.EndTime;
            findTimeEntry.HoursWorked = dto.HoursWorked;
            findTimeEntry.IsBillable = dto.IsBillable;
            findTimeEntry.Notes = dto.Notes;
            findTimeEntry.UpdatedOn = DateTime.Now;

        var updateTimeEntry = await _unitOfWork.TimeEntryRepository.UpdateTimeEntryAsync(findTimeEntry);

            var findTask = await _unitOfWork.TaskActivityRepository.GetTaskActivityByIdAsync(findTimeEntry.TaskId);
            if (findTask == null)
                return APIResponse<TimeEntryResponseDTO>.Fail("Task activity not found");

            findTask.TaskName = dto.TaskActivityName;
            findTask.IsBillableDefault = dto.IsBillable;

            var updateTask = await _unitOfWork.TaskActivityRepository.GetUpdateTaskActivityAsync(findTask);

            var result =  new TimeEntryResponseDTO
            {
                HoursWorked = findTimeEntry.HoursWorked.ToString(),
                IsBillable = findTimeEntry.IsBillable,
                Notes = findTimeEntry.Notes,
                ProjectName = findTimeEntry.Projects?.ProjectName,
                TaskName = findTimeEntry.TaskActivities?.TaskName,
                TimeEntryId = findTimeEntry.TimeEntryId.ToString(),
                TimesheetId = findTimeEntry.TimesheetId.ToString(),
                WorkDate = findTimeEntry.WorkDate,
            };
            return APIResponse<TimeEntryResponseDTO>.Ok(result, "Time entry updated successfully");

        }

        /// <summary>
        /// Deletes an existing time entry and its associated task activity from the database.
        /// Both the <see cref="TimeEntry"/> and the linked <see cref="TaskActivity"/> records are removed.
        /// Returns the deleted time entry's task ID on success.
        /// </summary>
        /// <param name="taskId"></param>
        /// <returns></returns>

        public async Task<APIResponse<Guid>> DeleteTimeEntryAsync(Guid taskId)
        {
            if (taskId == Guid.Empty)
                return APIResponse<Guid>.Fail("Invalid task ID");

            var findTimeEntry = await _unitOfWork.TimeEntryRepository.GetTimeEntryByTaskIdAsync(taskId);
            if (findTimeEntry == null)
                return APIResponse<Guid>.Fail("Time entry not found");

            await _unitOfWork.TimeEntryRepository.DeleteTimeEntryAsync(findTimeEntry);

            var findTask = await _unitOfWork.TaskActivityRepository.GetTaskActivityByIdAsync(taskId);
            if (findTask == null)
                return APIResponse<Guid>.Fail("Task activity not found");

            await _unitOfWork.TaskActivityRepository.GetDeleteTaskActivityAsync(findTask);

            return APIResponse<Guid>.Ok(findTimeEntry.TaskId, "Time entry deleted successfully");
        }
    }
}
