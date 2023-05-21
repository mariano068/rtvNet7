import * as p from '@clack/prompts';
import * as color from 'picocolors';

/**
 * Richiedi le informazioni per creare un nuovo progetto
 * @returns {Promise} Promise con le informazioni del progetto
 */
export const promptUserProject = async () => {

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
        });

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
