import { CLIENT_APP_REF } from "../constants";
import { ProfilePromptGroupAwaitedReturn } from "../types";

/**
 * Istruzioni da eseguire per creare un nuovo progetto AspNetCore MVC
 * @param {string} __name Nome del progetto
 * @param {"Net7.0|Net6.0"} __f framework di riferimento
 */
export const createAspNetCoreMVCProject = (profile: ProfilePromptGroupAwaitedReturn) => [
    `dotnet new mvc -f ${profile.__f} --name ${profile.__name}`,
    `cd ${profile.__name}`,
    `dotnet restore`
];

/**
 *  Istruzioni da eseguire per creare un nuovo progetto React con Vite
 * @param {string} __name Nome del progetto 
 * @param {"npm|yarn"} __pkm Package Manager 
 * @param {string} __template Vite.js template check https://vitejs.dev/guide/
 */
export const createReactProjectWithVite = (profile: ProfilePromptGroupAwaitedReturn) => [
    `cd ${profile.__name}`,
    `npm create vite@latest ${CLIENT_APP_REF} -- ${profile.__template}`,
    `cd ${CLIENT_APP_REF}`].concat(
        profile.__pkm === 'yarn' ?
            [`yarn`, `yarn add vite-plugin-mkcert --dev`] :
            [`npm i`, `npm install --save-dev vite-plugin-mkcert`]
    );
