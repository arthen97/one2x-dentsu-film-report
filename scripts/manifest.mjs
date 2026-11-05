import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const manifest=JSON.parse(await readFile(path.join(root,'asset-manifest.json'),'utf8'));
export function safePath(base,relative){const result=path.resolve(base,relative);if(result!==base&&!result.startsWith(base+path.sep))throw Error('Path escapes root: '+relative);return result}
export async function hashFile(file){const h=createHash('sha256');let size=0;for await(const b of createReadStream(file)){h.update(b);size+=b.length}return {size,sha256:h.digest('hex')}}
export function summary(){const result={logicalFiles:manifest.assets.length,bytes:0,images:{files:0,bytes:0},videos:{files:0,bytes:0},fonts:{files:0,bytes:0}};for(const a of manifest.assets){result.bytes+=a.size;const group=a.type==='image'?result.images:a.type==='video'?result.videos:a.type==='font'?result.fonts:null;if(group){group.files++;group.bytes+=a.size}}return result}
