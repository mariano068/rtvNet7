#!/usr/bin/env node
import * as p from '@clack/prompts';
import * as color from 'picocolors';
import * as path from 'path';
import { executeCommands } from '../utils/executeCommands';
import { generateOutro } from '../templates/generateOutro';
import { configureAspNetCoreMVCTemplate, configureReactTemplate } from '../utils/templateConfigs';
import { createAspNetCoreMVCProject, createReactProjectWithVite } from '../utils/projectCommands';
import { promptUserProject } from '../utils/promptUserProject';

async function main() {

	console.clear();
	p.intro(`${color.cyan(' create-rvnet-app ')}`);

	// Prompt per ottenere le informazioni del progetto
	const project = await promptUserProject();
	const spinner = p.spinner();
	const currentPath = process.cwd();
	const projectPath = path.join(currentPath, project.__name);

	spinner.start(`Creating ${project.__f} MVC Template`);

	// Esecuzione dei comandi per creare il progetto AspNetCore MVC
	executeCommands(createAspNetCoreMVCProject(project), () => {

		spinner.stop(`Created ${project.__f} MVC Template`);
		spinner.start('Creating React Project (this may take some time)');

		// Configurazione del template AspNetCore MVC
		configureAspNetCoreMVCTemplate(project, projectPath);

		// Esecuzione dei comandi per creare il progetto React con Vite
		executeCommands(createReactProjectWithVite(project), () => {

			spinner.stop('Created React Project');
			spinner.start('Removing unnecessary files');

			// Rimozione dei file non necessari
			configureReactTemplate(projectPath);

			spinner.stop('Removed unnecessary files');

			// Aggiunta delle note sul progetto
			generateOutro(project);
		});
	});
}

main().catch(console.error);