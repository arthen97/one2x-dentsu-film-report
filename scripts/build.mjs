import {createHash} from 'node:crypto';
import {createReadStream,createWriteStream} from 'node:fs';
import {mkdir,readFile,rename,rm} from 'node:fs/promises';
import path from 'node:path';
import {Readable,compose} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {createGunzip} from 'node:zlib';
import {root,manifest,safePath,summary} from './manifest.mjs';
const chunkManifest=JSON.parse(await readFile(path.join(root,'chunk-manifest.json'),'utf8'));
const chunkMap=new Map(chunkManifest.files.map(a=>[a.path,a]));
const dist=path.join(root,'dist');
await mkdir(dist,{recursive:true});
for(const asset of manifest.assets){
 const target=safePath(dist,asset.path),temporary=target+'.one2x-building';await mkdir(path.dirname(target),{recursive:true});
 const pieces=asset.storage==='chunks'?chunkMap.get(asset.path)?.parts:[{path:asset.path,size:asset.size,sha256:asset.sha256,encoding:'raw',decodedSize:asset.size,decodedSha256:asset.sha256}];
 if(!pieces?.length)throw Error('Missing chunks: '+asset.path);
 const whole=createHash('sha256');let total=0;
 async function* stream(){
  for(const part of pieces){
   if(!['gzip','raw'].includes(part.encoding))throw Error('Unknown encoding: '+part.path);
   const storedHash=createHash('sha256');let storedSize=0;
   async function* physical(){for await(const b of createReadStream(safePath(root,part.path))){storedHash.update(b);storedSize+=b.length;yield b}}
   const physicalStream=Readable.from(physical());
   const decoded=part.encoding==='gzip'?compose(physicalStream,createGunzip()):physicalStream;
   const decodedHash=createHash('sha256');let decodedSize=0;
   for await(const b of decoded){decodedHash.update(b);whole.update(b);decodedSize+=b.length;total+=b.length;yield b}
   if(storedSize!==part.size||storedHash.digest('hex')!==part.sha256)throw Error('Stored chunk checksum mismatch: '+part.path);
   if(decodedSize!==part.decodedSize||decodedHash.digest('hex')!==part.decodedSha256)throw Error('Decoded chunk checksum mismatch: '+part.path);
  }
 }
 try{await pipeline(Readable.from(stream()),createWriteStream(temporary));if(total!==asset.size||whole.digest('hex')!==asset.sha256)throw Error('Logical checksum mismatch: '+asset.path);await rename(temporary,target)}catch(error){await rm(temporary,{force:true});throw error}
}
console.log(JSON.stringify({build:'passed',storedAndDecodedChunksVerified:true,allLogicalSHA256Verified:true,output:'dist',...summary()},null,2));
