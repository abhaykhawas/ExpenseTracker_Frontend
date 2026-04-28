import React, { useState, useContext } from 'react'
import API from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Login() {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { data } = await API.post('/auth/login', form)
        login(data)
        navigate('/groups')
    }

    return (
        <div className='container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" onChange={e => setForm({...form, email: e.target.value})} />
                <input type="password" onChange={e => setForm({...form, password: e.target.value})} />
                <button>Login</button>
            </form>            
        </div>
    )
}

export default Login