import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import {useAuth} from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Login(){
 const [form,setForm]=useState({email:'',password:''}); const [busy,setBusy]=useState(false); const {login}=useAuth(); const navigate=useNavigate();
 const submit=async event=>{event.preventDefault();setBusy(true);try{await login(form);toast.success('Signed in successfully.');navigate('/dashboard')}catch(error){toast.error(error.response?.data?.message||'Could not sign in.')}finally{setBusy(false)}};
 return <main className="auth"><form onSubmit={submit} className="auth-card"><div className="eyebrow">Welcome back</div><h1>Continue learning.</h1><label>Email<input required type="email" value={form.email} onChange={event=>setForm({...form,email:event.target.value})} disabled={busy}/></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={event=>setForm({...form,password:event.target.value})} disabled={busy}/></label><button className="primary wide" disabled={busy}>{busy?<><LoadingSpinner/> Signing in…</>:'Sign in'}</button><p>New to ApexSolve? <Link to="/register">Create an account</Link></p></form></main>;
}
