using Kaizen.Domain.Extensions;
using Kaizen.Extensions;
using Kaizen.Infrastructure.Extensions;
using MediatR;
using MercadoPago.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Kaizen
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.LoadDbSettings(Configuration);
            services.LoadMailSettings(Configuration);
            services.ConfigureMailTemplates();

            services.RegisterDbContext(Configuration);
            services.ConfigureRepositories();
            services.AddIdentityConfig();
            services.AddMercadoPago(Configuration);

            services.AddJwtAuthentication(Configuration);
            services.ConfigureTokenGenerator();
            services.ConfigurePdfGenerator();
            services.AddSwagger(Configuration);

            services.AddAutoMapper(typeof(Startup));
            services.AddMediatR(typeof(Startup));
            services.ConfigureDomainEventDispatcher();
            services.ConfigureGlobalFilters();
            services.ConfigureApplicationServices();
            services.ConfigureHostedServices();

            services.AddCors();
            services.AddSignalR();

            services.AddHttpContextAccessor();

            services.AddControllersWithViews();
            services.AddRazorPages();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwaggerApiDocumentation(Configuration);
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.ConfigureExceptionHandler();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseHttpContext();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute("default", "{controller}/{action=Index}/{id?}");
                endpoints.ConfigureHubMaps();
            });
            app.ConfigureCors();

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer("start");
                }
            });
        }
    }
}
