const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = process;

const rl = readline.createInterface({ input: stdin, output: stdout });
const writeableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hello! Enter the text:\n');
rl.on('line', stdin => {
  if (stdin.trim() === 'exit') {
    rl.pause();
  } else {
    writeableStream.write(`${stdin}\n`);
  }
})

rl.on('SIGINT', () => {
  rl.pause();
});

rl.on('pause', (err) => {
  if (err) throw err;
  stdout.write('The end. Bye!')
});


