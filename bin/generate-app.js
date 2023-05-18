#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
var spawn = require('child_process').spawn;

if (process.argv.length < 3) {
    console.log('....');
    process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);

try {
    fs.mkdirSync(projectPath);
} catch (err) {
    if (err.code === 'EEXIST') {
        console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
    } else {
        console.log(error);
    }
    process.exit(1);
}

class Spinner {

    text = 'Installing dependencies...';

    start(customText) {
        this.text = customText || this.text;
        process.stdout.write('\x1B[?25l');
        const frames = ['-', '\\', '|', '/'];
        let i = 0;
        this.id = setInterval(() => {
            process.stdout.write(`\r ${this.text} ${frames[i]}`);
            i = (i + 1) % frames.length;
        }, 80);

        return this;
    }

    stop() {
        clearInterval(this.id);
        process.stdout.write(`\r\x1B[32m${this.text} ✓ \x1B[0m`);
        return this;
    }
}

const programTemplate = `
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// ↓ Add the following lines: ↓
builder.Services.AddSpaStaticFiles(configuration => {
    configuration.RootPath = "clientapp/dist";
});
// ↑ these lines ↑

var app = builder.Build();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// ↓ Add the following lines: ↓
var spaPath = "/app";
if (app.Environment.IsDevelopment())
{
    app.MapWhen(y => y.Request.Path.StartsWithSegments(spaPath), client =>
    {
        client.UseSpa(spa =>
        {
            spa.UseProxyToSpaDevelopmentServer("https://localhost:6363");
        });
    });
}
else
{
    app.Map(new PathString(spaPath), client =>
    {
        client.UseSpaStaticFiles();
        client.UseSpa(spa => {
            spa.Options.SourcePath = "clientapp";

            // adds no-store header to index page to prevent deployment issues (prevent linking to old .js files)
            // .js and other static resources are still cached by the browser
            spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
                    headers.CacheControl = new CacheControlHeaderValue
                    {
                        NoCache = true,
                        NoStore = true,
                        MustRevalidate = true
                    };
                }
            };
        });
    });
}
// ↑ these lines ↑

app.Run();
`;

const csprojTemplate = `
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.SpaServices.Extensions" Version="7.0.5" />
  </ItemGroup>

    <PropertyGroup>
		<SpaRoot>clientapp\</SpaRoot>
	</PropertyGroup>

	<Target Name="PublishRunWebpack" AfterTargets="ComputeFilesToPublish">
		<!-- As part of publishing, ensure the JS resources are freshly built in production mode -->
		<Exec WorkingDirectory="$(SpaRoot)" Command="npm install" />
		<Exec WorkingDirectory="$(SpaRoot)" Command="npm run build" />

		<!-- Include the newly-built files in the publish output -->
		<ItemGroup>
			<DistFiles Include="$(SpaRoot)dist\**" />  <!-- Changed to dist! -->
			<ResolvedFileToPublish Include="@(DistFiles->'%(FullPath)')" Exclude="@(ResolvedFileToPublish)">
				<RelativePath>%(DistFiles.Identity)</RelativePath> <!-- Changed! -->
				<CopyToPublishDirectory>PreserveNewest</CopyToPublishDirectory>
				<ExcludeFromSingleFile>true</ExcludeFromSingleFile>
			</ResolvedFileToPublish>
		</ItemGroup>
	</Target>  
</Project>
`

const viteConfigTemplate = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/app',
    server: {
        https: true,
        port: 6363
    },
    plugins: [react(), mkcert()],
})

`;

const block = (commands, success, options) => {
    const depSpin = new Spinner();
    var dotnetChild = spawn(commands.join(' && '), { shell: true });
    depSpin.start(options.message);
    dotnetChild
        .on('exit', () => {
            depSpin.stop();
            success();
        })
        .on('error', (err) => {
            console.log(err);
            depSpin.stop();
            process.exit(1);
        });
}

async function main() {

    try {

        block([
            `dotnet new mvc --name ${projectName}`,
            `cd ${projectName}`,
            `dotnet restore`
        ], () => {

            process.stdout.write(`\n`);

            fs.writeFileSync(path.join(projectPath, 'Program.cs'), programTemplate);
            fs.writeFileSync(path.join(projectPath, `${projectName}.csproj`), csprojTemplate);

            block([
                `dotnet restore`
            ], () => {

                process.stdout.write(`\n`);

                block([
                    `cd ${projectName}`,
                    `npm create vite@latest clientapp -- --template react-ts`,
                    `cd clientapp`,
                    `npm install --save-dev vite-plugin-mkcert`,
                    `npm i`,
                ], () => {

                    process.stdout.write(`\n`);
                    fs.writeFileSync(path.join(`${projectPath}/clientapp`, 'vite.config.ts'), viteConfigTemplate);
                    process.stdout.write(`\x1B[32mConfiguring vite ✓ \x1B[0m\n`);
                    fs.rm(path.join(projectPath, 'bin'), (error) => { });
                    process.stdout.write(`\x1B[32mRemoving unnecessary files ✓ \x1B[0m`);
                    console.log(`
..................P@@Y..................
..................Y@&7..................
..............    :PJ.    ..............
...........  :!J5GBBBBG5J!:  ...........
.......... ~5&@@&#GPPG#&@@&5^ ..........
..........J@@#J~:.    .:~J#@@J..........
........ ?@@G:::........:.:G@@? ........
........:#@@!!&&~      ?@#:!@@#:........
....... ~@@@P~77^^^~~^^^7!~P@@@~ .......
......  !@@@@@##&&@@@@@&##@@@@@!  ......
......7G&@@@@@@@@@@@@&#@#@&&@@@&G7......
.....:&@@@@@@@@@@@@@@57G!P7Y@@@@@&:.....
.....:&&#@@@@@@@@@@@@@@@@@@@@@@#&&:.....
.....:@5~@@@@@@@@@@@@@@@@@@@@@@~5@:.....
.....:&5^&@@@@@@@@@@@@@@@@@@@@&^5&:.....
.....J@#~?@@@@@@@@@@@@@@@@@@@@?~#@J.....
....:B@@J ~5#&@@@@@@@@@@@@&#5~ J@@B:....
......^:..  .^~Y##BBBB#B?~^.  ..:^......
...... ......  .?G&@@&P!. ...... .......
            `);
                }, {
                    message: 'Create React + Typescript + vite.js App...'
                });
            }, {
                message: 'Restoring packages...'
            });
        }, {
            message: 'Create Net7 MVC Template...'
        });
    } catch (error) {
        console.log(error);
    }
}

main();
