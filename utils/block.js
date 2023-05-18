import { spawn } from 'child_process';
import { Spinner } from './Spinner.js';

export const block = (commands, success, options) => {
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
