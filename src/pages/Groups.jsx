import React, { useEffect, useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Groups() {
    const navigate = useNavigate()
    const [groups, setGroups] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [memberIds, setMemberIds] = useState('')

    useEffect(() => {
        fetchGroups()
    }, [])

    const fetchGroups = async () => {
        const { data } = await API.get('/groups')
        setGroups(data)
    }

    const handleCreateGroup = async (e) => {
        e.preventDefault()
        const memberArray = memberIds.split(',').map(id => id.trim()).filter(id => id!== '')

        if(!groupName.trim()) {
            return
        }

        if(memberArray.length === 0) {
            return
        }

        const response = await API.post('/groups', {
            name: groupName,
            members: memberArray
        })

        setGroupName('')
        setMemberIds('')
        setShowModal(false)

        await fetchGroups()
        
    }

    return (
        <div className='container'>
            <div className="header" style={{display: 'flex', justifyContent: 'space-between'}}>
                <h2>Groups</h2>
                <button onClick={() => setShowModal(true)}>Create Group</button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className='modal-overlay' onClick={() => setShowModal(false)}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create a new Group</h3>
                            <button className='close-btn' onClick={() => setShowModal(false)}>Close</button>
                        </div>

                        <form onSubmit={handleCreateGroup}>
                            <div className="form-group">
                                <label htmlFor='groupName'>Group Name</label>
                                <input 
                                    type="text"
                                    id='groupName'
                                    placeholder='Enter group name...'
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="memberIds">Member IDs (separated by comma)</label>
                                <input 
                                    type="text"
                                    id='memberIds'
                                    placeholder='e.g., 501fa12ea222, 012avrhd5754ss'
                                    value={memberIds}
                                    onChange={(e) => setMemberIds(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="modal-action">
                                <button type='button' className='btn-secondary' onClick={
                                    () => setShowModal(false)
                                }
                                >Cancel</button>
                                <button
                                    type='submit'
                                    className='btn-primary'
                                >
                                    Create Group
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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