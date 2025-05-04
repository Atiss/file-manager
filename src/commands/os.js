import { cpus, homedir, userInfo, arch, EOL } from 'node:os';

const printEol = () => {
    console.info(JSON.stringify(EOL));
}

const printCpusInfo = () => {
    const cpuList = cpus().map(cpu => ({Model: cpu.model, 'Clock rate, GHz': cpu.speed/1000}));
    console.table(cpuList);
}

const printHomeDir = () => {
    console.info(`Your home dir is ${homedir()}`);
}

const printUsername = () => {
    console.info(`Your username is ${userInfo().username}`);
}

const printArchitecture = () => {
    console.info(`Your architecture is ${arch()}`);
}

export const getOsInfo = (arg) => {
    switch (arg) {
        case '--EOL':
            printEol();
            break;
        case '--cpus':
            printCpusInfo();
            break;
        case '--homedir':
            printHomeDir();
            break;
        case '--username':
            printUsername();
            break;
        case '--architecture':
            printArchitecture();
            break;
        default:
            throw new Error('Invalid arguments');
    }
}