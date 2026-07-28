import {createContext,useContext,useEffect,useState} from 'react';
import api from '../api/api';

const AuthContext=createContext();
export const useAuth=()=>useContext(AuthContext);
const savedUser=()=>{try{return JSON.parse(localStorage.getItem('apex_user')||'null')}catch{localStorage.removeItem('apex_user');localStorage.removeItem('apex_token');return null}};

export function AuthProvider({children}){
 const [user,setUser]=useState(savedUser);
 const save=session=>{const profile=session.user;localStorage.setItem('apex_token',session.token);localStorage.setItem('apex_user',JSON.stringify(profile));setUser(profile);if(import.meta.env.DEV)console.info('ApexSolve: user signed in',profile)};
 const login=async credentials=>{const response=await api.post('/auth/login',credentials);save(response.data)};
 const register=async details=>{const response=await api.post('/auth/register',details);save(response.data)};
 const logout=()=>{localStorage.removeItem('apex_token');localStorage.removeItem('apex_user');setUser(null);if(import.meta.env.DEV)console.info('ApexSolve: user signed out')};
 useEffect(()=>{
  const clearExpiredSession=()=>setUser(null);
  window.addEventListener('apexsolve:session-expired',clearExpiredSession);
  return()=>window.removeEventListener('apexsolve:session-expired',clearExpiredSession);
 },[]);
 return <AuthContext.Provider value={{user,login,register,logout}}>{children}</AuthContext.Provider>;
}
