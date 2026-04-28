import React, { useEffect, useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Groups() {
    const navigate = useNavigate()
    const [groups, setGroups] = useState([])

    useEffect(() => {
        fetchGroups()
    }, [])

    const fetchGroups = async () => {
        const { data } = await API.get('/groups')
        setGroups(data)
    }

    return (
        <div className='container'>
            <div className="header" style={{display: 'flex', justifyContent: 'space-between'}}>
                <h2>Groups</h2>
                <button>Create Group</button>
            </div>
            {groups.map(g => (
                
                <div key={g._id} className='card'>
                    <h3>{g.name}</h3>
                    <p>Member: {g.members.map(m => m.name).join(', ')}</p>
                    <button onClick={() => navigate(`/dashboard/${g._id}`)}>Open Group</button>
                </div>
            ))}
        </div>
    )
}

export default Groups