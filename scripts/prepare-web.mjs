import { cp, mkdir, copyFile, rm } from "node:fs/promises";
await rm("www",{recursive:true,force:true});
await mkdir("www",{recursive:true});
for (const file of ["index.html","manifest.webmanifest","sw.js"]) await copyFile(file,"www/"+file);
await cp("src","www/src",{recursive:true});
