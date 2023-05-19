import * as p from '@clack/prompts';
import color from 'picocolors';
import fs from 'fs';
import path from 'path';
import { program } from '../templates/Net7.0/program.js';
import { csproj } from '../templates/Net7.0/.csproj.js';
import { vite } from '../templates/Net7.0/vite.config.js';

// Riferimento alla cartella del progetto React
const CLIENT_APP_REF = 'clientapp';

/**
 * Istruzioni da eseguire per creare un nuovo progetto AspNetCore MVC
 * @param {string} __name Nome del progetto
 * @param {"Net7.0|Net6.0"} __f framework di riferimento
 */
export const netCmd = (__name, __f) => [
  `dotnet new mvc -f ${__f} --name ${__name}`,
  `cd ${__name}`,
  `dotnet restore`
];

/**
 *  Istruzioni da eseguire per creare un nuovo progetto React con Vite
 * @param {string} __name Nome del progetto 
 * @param {"npm|yarn"} __pkm Package Manager 
 * @param {string} __template Vite.js template check https://vitejs.dev/guide/
 */
export const pkmCmd = (__name, __pkm, __template) => [
  `cd ${__name}`,
  `npm create vite@latest ${CLIENT_APP_REF} -- ${__template}`,
  `cd ${CLIENT_APP_REF}`].concat(
    __pkm === 'yarn' ?
      [`yarn`, `yarn add vite-plugin-mkcert --dev`] :
      [`npm i`, `npm install --save-dev vite-plugin-mkcert`]
  );

/**
 * Richiedi le informazioni per creare un nuovo progetto
 * @returns {Promise} Promise con le informazioni del progetto
 */
export const userPJ = async () => {

  console.clear();
  p.intro(`${color.bgCyan(color.black(' Create App '))}`);

  /**
   * Richiedi il nome del progetto
   */
  const __name = () =>
    p.text({
      message: 'Provide a name for your project',
      initialValue: 'AppDemo1',
      validate: (value) => {
        if (!value) return 'Please enter a name.';
      },
    })
  /**
   * Richiedi il framework di riferimento
   */
  const __f = () =>
    p.select({
      message: `Choose Net framework version`,
      initialValue: 'Net7.0',
      options: [
        { value: 'Net7.0', label: '7.0' },
        { value: 'Net6.0', label: '6.0' }
      ]
    });
  /**
   * Richiedi il template Vite di riferimento
   */
  const __template = () =>
    p.select({
      message: `Choose vite template`,
      initialValue: '--template=react-ts',
      options: [
        { value: '--template=react-ts', label: 'TypeScript', hint: 'recommended' },
        { value: 'vanilla', label: 'JavaScript' }
      ],
    });
  /**
   *  Richiedi il package manager di riferimento
   */
  const __pkm = () =>
    p.select({
      message: `npm or yarn?`,
      initialValue: 'yarn',
      options: [
        { value: 'yarn', label: 'yarn', hint: 'recommended' },
        { value: 'npm', label: 'npm' }
      ],
    })

  const project = await p.group(
    {
      __name,
      __f,
      __template,
      __pkm
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.');
        process.exit(0);
      },
    }
  );

  return project;
}

export const UseReactTemplates = (project, projectPath, currentPath) => {

  fs.writeFileSync(path.join(`${projectPath}/clientapp`, 'vite.config.js'), vite);
  fs.rm(path.join(projectPath, 'bin'), (error) => { });
}

export const UseNetTemplates = (project, projectPath, currentPath) => {

  fs.writeFileSync(
    path.join(projectPath, 'Program.cs'),
    program.replace('{{CLIENT_APP_REF}}', CLIENT_APP_REF)
  );
  fs.writeFileSync(
    path.join(projectPath, `${project.__name}.csproj`),
    csproj.replace('{{CLIENT_APP_REF}}', CLIENT_APP_REF).replace('{{PKM}}', project.__pkm)
  )
}
