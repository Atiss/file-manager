import { readdir, stat } from 'node:fs/promises';
import { resolve, dirname, parse } from 'node:path';

export const list = async (path) => {
    try {
        const files = await readdir(path, {withFileTypes: true});
        const sorted = files.map((file) => ({Name: file.name, Type: file.isDirectory() ? 'directory' : 'file'}))
             .sort((a, b) => a.Name.localeCompare(b.Name))
             .sort((a, b) => a.Type.localeCompare(b.Type));
        console.table(sorted);
    }  catch (err) {
        throw new Error('FS operation failed');
    }
};

export const up = async (path) => {
    return dirname(path);
}

export const cd = async (path, currentDir) => {
    if(!path) throw new Error('Invalid arguments');
    const newPath = resolve(currentDir, path);
    console.log(newPath);
    const pathStat = await stat(newPath);
    if(!pathStat.isDirectory()) throw new Error('Invalid arguments');
    return newPath;
}