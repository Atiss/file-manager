import readline from 'node:readline';
import os from 'node:os'

let homeDir = os.homedir();

const args = process.argv.slice(2);
const username = args[1].replace('--username=', '');
console.log(`Welcome to the File Manager, ${username}!`);

const readLn = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
});
newLn();

readLn.on('close', () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`)
    process.exit(0);
});

readLn.on('line', (chunk) => {
    const chunkStringified = chunk.toString();
    if (chunkStringified.includes('.exit')) readLn.close();
    newLn();
})

function newLn() {
    process.stdout.write(`You are currently in ${homeDir}\n`);
    readLn.prompt();
}