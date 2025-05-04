import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { stat } from 'node:fs/promises';
import { basename } from 'node:path';

const parseArgs = async (args, currentDir) => {
    if(!args || args.length === 0) throw new Error('Invalid arguments')
    const inputPath = args[0];
    const inputStat = await stat(inputPath);
    if(inputStat.isDirectory()) {
        throw new Error('Invalid arguments');
    }
    let outputPath = args[1] ? args[1] : currentDir;
    let outputStat;
    try {
        outputStat = await stat(outputPath);
        if(outputStat.isDirectory()) {
            outputPath += `/${basename(inputPath)}`;
        }
    } catch (err) {
        if(err.code !== 'ENOENT') {
            throw new Error('Invalid arguments');
        }
    }

    return [inputPath, outputPath];
}

export const compress = async (args, currentDir) => {
    const [inputPath, outputPath] = await parseArgs(args, currentDir);
    const zip = createBrotliCompress();
    const source = createReadStream(inputPath);
    const destination = createWriteStream(outputPath+'.br');
    try {
        await pipeline(source, zip, destination);
    } catch (err) {
        throw new Error('Cannot create zip:', err);
    }
};

export const decompress = async (args, currentDir) => {
    const [inputPath, outputPath] = await parseArgs(args, currentDir);
    const unzip = createBrotliDecompress();
    const source = createReadStream(inputPath);
    const destination = createWriteStream(outputPath.replace('.br', ''));
    try {
        await pipeline(source, unzip, destination);
    } catch (err) {
        throw new Error('Cannot create unziped:', err);
    }
};
