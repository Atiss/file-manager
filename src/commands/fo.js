import { existsSync, createReadStream, createWriteStream } from 'node:fs';
import { stdout } from 'node:process';
import { writeFile, mkdir, rename as fsRename, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

export const read = async (path, currentDir) => {
    if(!path) throw new Error('Invalid arguments');
    const currentPath = resolve(currentDir, path);
    try {
        if(path && existsSync(currentPath)) {
            const readableStream = createReadStream(currentPath);
            readableStream.on('data', (chunk) => stdout.write(`${chunk}\n`))
        }
        else throw new Error('Invalid arguments');
    } catch (err) {
        throw new Error('FS operation failed');
    }
};

export const create = async (path, currentDir) => {
    if(!path) throw new Error('Invalid arguments');
    const currentPath = resolve(currentDir, path);
    try {
        if(currentPath) await writeFile(path, '', {flag: 'wx'});
        else throw new Error('Invalid arguments');
    } catch(err) {
        throw new Error('FS operation failed');
    }
};

export const createDir = async (path, currentDir) => {
    if(!path) throw new Error('Invalid arguments');
    const currentPath = resolve(currentDir, path);
    try {
        mkdir(currentPath);
    } catch (err) {
        throw new Error('FS operation failed');
    }
}

export const rename = async (path, newName, currentDir) => {
    if(!path || !newName) throw new Error('Invalid arguments');
    const currentPath = resolve(currentDir, path);
    try {
        if (existsSync(newName)) throw new Error(`File ${newName} already exists`);
        await fsRename(currentPath, newName);
    } catch (err) {
        throw new Error('FS operation failed');
    }
};

const copyStream = async(source, destination) => {
    const readStream = createReadStream(source);
    const writeStream = createWriteStream(destination);

    return new Promise((resolve, reject) => {
        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('finish', resolve);
        readStream.pipe(writeStream);
    })
}
export const copy = async (path, destination, currentDir) => {
    if(!path || !destination) throw new Error('Invalid arguments');
    const source = resolve(currentDir, path);
    try{
        await copyStream(source, destination);
        console.info('Successfully copied');
    }catch (err) {
        throw new Error(err);
    }
}

export const move = async (path, destination, currentDir) => {
    if(!path || !destination) throw new Error('Invalid arguments');
    const source = resolve(currentDir, path);
    try{
        await copyStream(source, destination);
        await rm(source)
        console.info('Successfully moved');
    }catch (err) {
        throw new Error(err);
    }
}

export const remove = async (path, currentDir) => {
    if(!path) throw new Error('Invalid arguments');
    const filePath = resolve(currentDir, path);
    try {
        await rm(filePath);
    } catch (err) {
        throw err;
    }
}