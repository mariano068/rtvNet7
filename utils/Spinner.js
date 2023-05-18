export class Spinner {

  text = 'Installing dependencies...';

  start(customText) {
      this.text = customText || this.text;
      process.stdout.write('\x1B[?25l');
      const frames = ['-', '\\', '|', '/'];
      let i = 0;
      this.id = setInterval(() => {
          process.stdout.write(`\r ${this.text} ${frames[i]}`);
          i = (i + 1) % frames.length;
      }, 80);

      return this;
  }

  stop() {
      clearInterval(this.id);
      process.stdout.write(`\r\x1B[32m${this.text} ✓ \x1B[0m`);
      return this;
  }
}
