import multer from 'multer';
import path from 'path';
import fs from 'fs';

const root=path.resolve('uploads');
for(const dir of ['images','audio'])fs.mkdirSync(path.join(root,dir),{recursive:true});

const storage=multer.diskStorage({
 destination:(req,file,cb)=>cb(null,path.join(root,file.mimetype.startsWith('image/')?'images':'audio')),
 filename:(req,file,cb)=>cb(null,`${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`)
});

const createUploader=(acceptedTypes,label)=>multer({
 storage,
 limits:{fileSize:Number(process.env.MAX_FILE_SIZE||10485760)},
 fileFilter:(req,file,cb)=>{
  if(acceptedTypes.includes(file.mimetype))return cb(null,true);
  const error=new Error(`${label} must be one of: ${acceptedTypes.join(', ')}.`);
  error.status=400;
  return cb(error);
 }
});

export const imageUpload=createUploader(['image/jpeg','image/png','image/webp'],'Image').single('image');
export const audioUpload=createUploader(['audio/webm','audio/ogg','audio/mpeg','audio/wav','audio/mp4'],'Audio recording').single('audio');
