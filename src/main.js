import readline from 'node:readline';
import os from 'node:os'
import {compress, decompress} from "./commands/zip.js";
import {list, up, cd} from "./commands/fs.js";

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

readLn.on('line', async (chunk) => {
    const chunkStringified = chunk.toString();
    if (chunkStringified.includes('.exit')) readLn.close();
    await handleCommands(chunk)
    newLn();
})

function newLn() {
    process.stdout.write(`You are currently in ${homeDir}\n`);
    readLn.prompt();
}

async function handleCommands(commandString) {
    const [command, ...args] = commandString.split(' ').map((value) => value.trim());
    try {
        switch (command) {
            case 'compress':
                await compress(args, homeDir);
                console.info('Successfully compressed');
                break;
            case 'decompress':
                await decompress(args, homeDir);
                console.info('Successfully decompressed');
                break;
            case 'ls':
                await list(homeDir);
                break;
            case 'up':
                homeDir = await up(homeDir);
                break;
            case 'cd':
                homeDir = await cd(args[0], homeDir);
            default:
                console.error('Invalid input');
        }
    }catch (err) {
        if(err.message === 'Invalid arguments') {
            console.error('Invalid input arguments');
        } else console.error('Operation failed', err.message);
    }
}