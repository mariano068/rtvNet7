import { spawn } from 'child_process';

export const block = (commands, success, options) => {
  var dotnetChild = spawn(commands.join(' && '), { shell: true });
  dotnetChild
      .on('exit', () => {
          success();
      })
      .on('error', (err) => {
          console.log(err);
          process.exit(1);
      });
}
