#!/usr/bin/env node
import * as p from '@clack/prompts';
import color from 'picocolors';
import path from 'path';
import { block } from '../utils/block.js';
import { note } from '../utils/note.js';
import { netCmd, pkmCmd, UseNetTemplates, UseReactTemplates, userPJ } from '../utils/rtvNet7.js';

async function main() {

	console.clear();
	p.intro(`${color.bgCyan(color.black(' Create App '))}`);

	const project = await userPJ();

	const s = p.spinner();
	const currentPath = process.cwd();
	const projectPath = path.join(currentPath, project.__name);

	s.start(`Creating ${project.__f} MVC Template`);

	block(netCmd(project.__name, project.__f), () => {

		s.stop(`Create ${project.__f} MVC Template`);
		s.start('Creating React Project');

		UseNetTemplates(project, projectPath, currentPath);

		block(pkmCmd(project.__name, project.__pkm, project.__template), () => {

			s.stop("Create React Project");
			s.start('Removing unnecessary files');

			UseReactTemplates(project, projectPath, currentPath);
			
			s.stop("Removed unnecessary files");

			note(project);
		});
	});
}

main().catch(console.error);