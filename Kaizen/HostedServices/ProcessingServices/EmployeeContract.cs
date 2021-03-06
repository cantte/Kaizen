using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Kaizen.Core.Services;
using Kaizen.Domain.Entities;
using Kaizen.Domain.Repositories;

namespace Kaizen.HostedServices.ProcessingServices
{
    public class EmployeeContract : IScopedProcessingService
    {
        private static readonly int DelayTime = (int)TimeSpan.FromDays(1.0).TotalMilliseconds;

        private readonly IEmployeesRepository _employeesRepository;
        private readonly IMailService _mailService;
        private readonly IMailTemplate _mailTemplate;

        public EmployeeContract(IEmployeesRepository employeesRepository, IMailService mailService, IMailTemplate mailTemplate)
        {
            _employeesRepository = employeesRepository;
            _mailService = mailService;
            _mailTemplate = mailTemplate;
        }

        public async Task DoWork(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                IEnumerable<Employee> employees = await _employeesRepository.EmployeesWithContractCloseToExpiration();
                foreach (Employee employee in employees)
                {
                    string mailMessage = _mailTemplate.LoadTemplate("ContractCloseToExpiration.html", $"{employee.LastName} {employee.FirstName}",
                        employee.ContractCode,
                        employee.EmployeeContract.EndDate.ToShortDateString());

                    await _mailService.SendEmailAsync(employee.User.Email, "Contrato a punto de vencer", mailMessage, true);
                }

                await Task.Delay(DelayTime, cancellationToken);
            }
        }
    }
}
