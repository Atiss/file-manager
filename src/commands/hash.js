import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import { resolve } from 'node:path';

export const calculateHash = async (path, currentDir) => {
    if(!path) throw new Error('Invalid arguments');
    const currentPath = resolve(currentDir, path);
    try {
        const hash = createHash('sha256');
        await pipeline(createReadStream(currentPath),
            async (source) => {
                source.setEncoding('utf8');
                for await (let chunk of source) {
                    hash.update(chunk);
                }
            });
        console.log(hash.digest('hex'));
    } catch (err) {
        console.log(err);
    }
};