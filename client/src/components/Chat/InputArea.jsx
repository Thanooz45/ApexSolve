import {useRef,useState} from 'react';
import {Send,ImagePlus,Mic,Square} from 'lucide-react';
import toast from 'react-hot-toast';

export default function InputArea({onSend,busy}){
 const [text,setText]=useState(''),[recording,setRecording]=useState(false);
 const input=useRef(),rec=useRef(),parts=useRef([]);
 const send=()=>{if(text.trim()&&!busy){onSend('text',text.trim());setText('')}};
 const file=e=>{const f=e.target.files[0];e.target.value='';if(!f||busy)return;if(!f.type.startsWith('image/'))return toast.error('Please choose an image file.');onSend('image',f)};
 const voice=async()=>{
  if(recording){rec.current?.stop();setRecording(false);return}
  if(busy)return;
  try{
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});
   rec.current=new MediaRecorder(stream);parts.current=[];
   rec.current.ondataavailable=e=>parts.current.push(e.data);
   rec.current.onerror=()=>toast.error('Recording failed. Please try again.');
   rec.current.onstop=()=>{stream.getTracks().forEach(t=>t.stop());const recordingFile=new File(parts.current,'question.webm',{type:rec.current.mimeType||'audio/webm'});if(recordingFile.size)onSend('voice',recordingFile);else toast.error('No audio was recorded. Please try again.')};
   rec.current.start();setRecording(true);
  }catch{toast.error('Microphone permission is needed for voice doubts.')}
 };
 return <div className="composer"><textarea value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Ask anything — algebra, biology, code..." rows="1"/><div className="composer-actions"><label className={`icon-button ${busy?'disabled':''}`} title="Upload image"><ImagePlus size={20}/><input ref={input} type="file" accept="image/*" disabled={busy} onChange={file}/></label><button className={`icon-button ${recording?'recording':''}`} disabled={busy&&!recording} onClick={voice} title="Record voice">{recording?<Square size={18}/>:<Mic size={20}/>}</button><button className="send" disabled={busy||!text.trim()} onClick={send}><Send size={19}/></button></div></div>
}
