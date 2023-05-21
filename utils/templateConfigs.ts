
import * as fs from 'fs';
import * as path from 'path';
import { program } from '../templates/Net7.0/program';
import { csproj } from '../templates/Net7.0/.csproj';
import { vite } from '../templates/Net7.0/vite.config';
import { CLIENT_APP_REF } from '../constants';
import { ProfilePromptGroupAwaitedReturn } from '../types';
import { tokenReplace } from './tokenReplace';

// Configura il template React
export const configureReactTemplate = (projectPath: string) => {
  const viteConfigPath = path.join(`${projectPath}/${CLIENT_APP_REF}`, 'vite.config.js');
  fs.writeFileSync(viteConfigPath, vite);
  fs.rm(path.join(projectPath, 'bin'), () => {  }); // Rimozione dei file non necessari
};

// Configura il template AspNetCore MVC
export const configureAspNetCoreMVCTemplate = (project: ProfilePromptGroupAwaitedReturn, projectPath: string) => {
  const programPath = path.join(projectPath, 'Program.cs');
  const csprojPath = path.join(projectPath, `${project.__name}.csproj`);

  fs.writeFileSync(programPath, tokenReplace(program, { CLIENT_APP_REF })); // Configurazione del file Program.cs
  fs.writeFileSync(csprojPath, tokenReplace(csproj, { CLIENT_APP_REF, PKM: project.__pkm })); // Configurazione del file .csproj
};
