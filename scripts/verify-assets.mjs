import path from 'node:path';
import {readdir} from 'node:fs/promises';
import {root,manifest,safePath,hashFile,summary} from './manifest.mjs';
const dist=path.join(root,'dist');
for(const asset of manifest.assets){const actual=await hashFile(safePath(dist,asset.path));if(actual.size!==asset.size||actual.sha256!==asset.sha256)throw Error('Asset mismatch: '+asset.path)}
async function walk(dir){const result=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())result.push(...await walk(p));else if(e.isFile())result.push(path.relative(dist,p).split(path.sep).join('/'))}return result}
const built=await walk(dist),expected=new Set(manifest.assets.map(a=>a.path));const extra=built.filter(p=>!expected.has(p));if(extra.length)throw Error('Unexpected dist files: '+extra.join(', '));
console.log(JSON.stringify({verification:'passed',allLogicalSHA256Verified:true,exactDistFileSet:true,...summary()},null,2));
