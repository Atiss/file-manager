import readline from 'node:readline';
import os from 'node:os'
import {compress, decompress} from "./commands/zip.js";

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
    handleCommands(chunk)
    newLn();
})

function newLn() {
    process.stdout.write(`You are currently in ${homeDir}\n`);
    readLn.prompt();
}

function handleCommands(commandString) {
    const [command, ...args] = commandString.split(' ').map((value) => value.trim());
    console.log(args)
    switch (command) {
        case 'compress':
            compress(args, homeDir);
            console.info('Successfully compressed');
            break;
        case 'decompress':
            decompress(args, homeDir);
            console.info('Successfully decompressed');
            break;
    }
}