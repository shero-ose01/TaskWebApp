
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY TaskApp.Api/TaskApp.Api.csproj TaskApp.Api/
RUN dotnet restore TaskApp.Api/TaskApp.Api.csproj
COPY TaskApp.Api/ TaskApp.Api
RUN dotnet build TaskApp.Api/TaskApp.Api.csproj -c Release --no-restore

FROM build AS publish
RUN dotnet publish TaskApp.Api/TaskApp.Api.csproj -c Release -o /publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /publish .
USER root
RUN mkdir -p /home/app/.aspnet/DataProtection-Keys \ && chown -R app:app /home/app/.aspnet
USER app
ENTRYPOINT ["dotnet", "TaskApp.Api.dll"]
