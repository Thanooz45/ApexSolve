import {useEffect,useRef,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ChevronLeft,PanelLeft,BookOpen} from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';
import MessageBubble from '../components/Chat/MessageBubble';
import InputArea from '../components/Chat/InputArea';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ChatPage(){
 const {id}=useParams(); const [chat,setChat]=useState(null); const [busy,setBusy]=useState(false); const bottom=useRef();
 useEffect(()=>{let active=true;api.get(`/chats/${id}`).then(response=>{if(active)setChat(response.data)}).catch(()=>{if(active)toast.error('Chat unavailable.')});return()=>{active=false}},[id]);
 useEffect(()=>{bottom.current?.scrollIntoView({behavior:'smooth'})},[chat?.messages,busy]);
 const send=async(type,value)=>{if(!chat||busy)return;const optimistic={_id:`temp${Date.now()}`,role:'user',content:type==='text'?value:type==='image'?'Image doubt':'Voice doubt',inputType:type,...(type==='image'?{imageUrl:URL.createObjectURL(value)}:type==='voice'?{audioUrl:URL.createObjectURL(value)}:{})};setChat(current=>({...current,messages:[...(current.messages||[]),optimistic]}));setBusy(true);try{let response;if(type==='text')response=await api.post(`/chats/${id}/text`,{text:value});else{const form=new FormData();form.append(type==='voice'?'audio':'image',value);response=await api.post(`/chats/${id}/${type}`,form)}setChat(response.data.chat)}catch(error){setChat(current=>({...current,messages:(current.messages||[]).filter(message=>message._id!==optimistic._id)}));toast.error(error.response?.data?.message||'Could not solve that doubt.')}finally{setBusy(false)}};
 if(!chat)return <main className="center"><LoadingSpinner/></main>;
 const messages=Array.isArray(chat.messages)?chat.messages:[];
 return <main className="workspace"><aside><Link to="/dashboard"><ChevronLeft size={17}/> All learning</Link><div className="chat-subject"><BookOpen size={19}/><span>{chat.subject||'General'}</span></div><p>Answers are private to your account.</p></aside><section className="thread"><div className="thread-head"><div><span className="eyebrow">Apex tutor</span><h2>{chat.title||'New doubt'}</h2></div><PanelLeft size={20}/></div><div className="messages">{messages.length?messages.map(message=><MessageBubble key={message._id} message={message}/>):<div className="starter"><BookOpen/><h2>Let's untangle this.</h2><p>Ask a question in your own words, or add an image or voice recording.</p></div>}{busy&&<div className="thinking"><LoadingSpinner/> Apex is thinking through it…</div>}<div ref={bottom}/></div><InputArea onSend={send} busy={busy}/></section></main>;
}
