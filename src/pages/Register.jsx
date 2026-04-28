import React, { useState, useContext } from 'react'
import API from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
 

function Register() {
        const { login } = useContext(AuthContext)
        const [form, setForm] = useState({ name: '', email: '', password: '' })
        const navigate = useNavigate()
    
        const handleSubmit = async (e) => {
            e.preventDefault()
            const { data } = await API.post('/auth/register', form)
            login(data)
            navigate('/groups')
        }
    
        return (
            <div className='container'>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" onChange={e => setForm({...form, email: e.target.value})} />
                    <input type="email" onChange={e => setForm({...form, email: e.target.value})} />
                    <input type="password" onChange={e => setForm({...form, password: e.target.value})} />
                    <button>Signup</button>
                </form>            
            </div>
        )
}


export default Register