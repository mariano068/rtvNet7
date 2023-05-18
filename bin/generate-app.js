#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { programTemplate } from '../assets/program-template.js';
import { csprojTemplate } from '../assets/csproj-template.js';
import { block } from '../utils/block.js';
import { gitlogo } from '../utils/gitlogo.js';
import { viteConfigTemplate } from '../assets/vite-template.js';

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
                    gitlogo();
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
