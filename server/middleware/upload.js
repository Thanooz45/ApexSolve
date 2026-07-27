import multer from 'multer'; import path from 'path'; import fs from 'fs';
const root=path.resolve('uploads'); for(const dir of ['images','audio'])fs.mkdirSync(path.join(root,dir),{recursive:true});
const storage=multer.diskStorage({destination:(req,file,cb)=>cb(null,path.join(root,file.mimetype.startsWith('image/')?'images':'audio')),filename:(req,file,cb)=>cb(null,`${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`)});
const upload=multer({storage,limits:{fileSize:Number(process.env.MAX_FILE_SIZE||10485760)},fileFilter:(req,file,cb)=>cb(null,file.mimetype.startsWith('image/')||file.mimetype.startsWith('audio/'))}); export const imageUpload=upload.single('image');export const audioUpload=upload.single('audio');
