import * as p from '@clack/prompts';
import * as color from 'picocolors';
import { ProfilePromptGroupAwaitedReturn } from '../types';
import { CLIENT_APP_REF } from '../constants';

export const generateOutro = (project: ProfilePromptGroupAwaitedReturn) => {

  let nextSteps = `
${color.cyan('Congratulations on creating your new project!')} 

Here are the details of your project:
${color.red('Project Name:')} ${project.__name}
${color.red('Framework Version:')} ${project.__f}
${color.red('Vite Template:')} ${project.__template}
${color.red('Package Manager:')} ${project.__pkm}

Follow the next steps to get started:

> ${color.cyan(`From the ${CLIENT_APP_REF} folder`)}
  Run the following command:
  ${color.bgCyan(color.black(project.__pkm === 'yarn' ? ' yarn run dev ' : ' npm run dev '))}

> ${color.cyan(`From the root folder`)}
  To start the backend server, run the following command:
  ${color.bgCyan(color.black(' dotnet run start '))}
  Alternatively, you can use Visual Studio to run the project.

Happy coding and enjoy your new project!
`;

  p.outro(nextSteps);
};