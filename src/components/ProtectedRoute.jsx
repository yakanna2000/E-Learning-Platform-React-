import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
export function ProtectedRoute({children,role}){const {session,profile,loading}=useApp();if(loading)return <p className="center">Loading your account…</p>;if(!session)return <Navigate to="/login" replace/>;if(role&&profile?.role!==role)return <Navigate to="/dashboard" replace/>;return children}
