import readline from 'node:readline';
import os from 'node:os'
import {compress, decompress} from "./commands/zip.js";
import {list, up, cd} from "./commands/fs.js";
import {create, createDir, read, rename, copy, move, remove} from './commands/fo.js';
import {getOsInfo} from "./commands/os.js";
import {calculateHash} from "./commands/hash.js";

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
    if (chunkStringified) await handleCommands(chunk);
    newLn();
});


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
                break;
            case 'cat':
                await read(args[0], homeDir);
                break;
            case 'add':
                await create(args[0], homeDir);
                break;
            case 'mkdir':
                await createDir(args[0], homeDir);
                break;
            case 'rn':
                await rename(args[0], args[1], homeDir);
                break;
            case 'cp':
                await copy(args[0], args[1], homeDir);
                break;
            case 'mv':
                await move(args[0], args[1], homeDir);
                break;
            case 'rm':
                await remove(args[0], homeDir);
                break;
            case 'os':
                await getOsInfo(args[0]);
                break;
            case 'hash':
                await calculateHash(args[0], homeDir);
                break;
            default:
                console.error('Invalid input');
        }
    }catch (err) {
        if(err.message === 'Invalid arguments') {
            console.error('Invalid input arguments');
        } else console.error('Operation failed', err.message);
    }
}