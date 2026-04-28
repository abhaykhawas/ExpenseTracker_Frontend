import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api/axios'

function Dashboard() {

    const { logout, user } = useContext(AuthContext)
    const navigate = useNavigate()
    const {id} = useParams()
    const [balances, setBalances] = useState([])
    const [transactions, setTransactions] = useState([])
    const [members, setMembers] = useState([])
    const [groupName, setGroupName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [showAddTxn, setShowAddTxn] = useState(false)
    const [txForm, setTxForm] = useState({ amount: '', 'description': '', paidBy: '', splitWith: [] })




    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {

        try{
            setError('')
            setLoading(true)

            const [balancesRes, transactionsRes, groupRes] = await Promise.all([
                API.get(`/balance?groupId=${id}`),
                API.get(`/transactions?groupId=${id}`),
                API.get(`/groups/${id}`)
            ])

            setBalances(Array.isArray(balancesRes.data) ? balancesRes.data : [])
            setTransactions(Array.isArray(transactionsRes.data) ? transactionsRes.data : [])
            
            const group = groupRes.data || {}
            setGroupName(group.name || "")
            setMembers(Array.isArray(group.members) ? group.members : [])

            
        }
        catch(err) {
            setError("Something went wrong")
            setBalances([])
            setTransactions([])
            setMembers([])
            setGroupName('')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    async function handleCreateTransaction(e) {
        e.preventDefault()
        try{
            setError('')
            console.log(txForm.paidBy)
            await API.post('/transactions', {
                groupId: id,
                amount: Number(txForm.amount),
                description: txForm.description,
                paidBy: txForm.paidBy,
                splitWith: txForm.splitWith,
            })

            setShowAddTxn(false)
            setTxForm({amount: '', 'description': '', paidBy: '', splitWith: []})
            await fetchData()
        }
        catch(err){

        }
    }

    return (
    <div className="container">
        <div className="dashboard-navigation">
            <div><Link to={'/groups'}>↩</Link></div>
            <div className="dash-main-menu">
                <h2>{groupName || 'Group'}</h2>
                <h2><Link to={'/groups'}>GROUPS</Link></h2>
            </div>
            <div>
                <button onClick={() => setShowAddTxn(true)}>Add Transaction</button>
                <button onClick={handleLogout} >Logout</button>
            </div>
        </div>

        <div className="main-dashbaord">
            <div className="group-balances-container">
               <h3>Balances</h3>
               {loading ? (
                <div>loading...</div>
               ) : error ? (
                <div>{error}</div>
               ) : balances.length === 0 ? (
                <div>No Balances Found</div>
               ) : (
                balances.map((b) => (
                    <div key={b._id}>
                        <div>
                            <strong>{b.userId?.name || 'User'}</strong>
                        </div>
                        <div>{b.balance || 0}</div>
                    </div>
                ))
               )}
            </div>
            <div className="group-transactions-container">
                <h3>Transactions</h3>
                {loading ? (
                    <div>loading...</div>
                ): error ? (
                    <div>{error}</div>
                ) : transactions.length === 0 ? (
                    <div>No Transactions Yet</div>
                ) : (
                    transactions.map((t) => (
                        <div key={t._id}>
                            <div>
                                <strong>{t.description ||'Transaction'}</strong>
                            </div>
                            <div>Amount : {t.amount}</div>
                            <div>Paid BY : {t.paidBy?.name}</div>
                            <div>
                                Split with: {' '}
                                {Array.isArray(t.splitWith) && t.splitWith.length ? t.splitWith.map((u) => u?.name).join(', ') : '-'}
                            </div>
                            <div>Tnx Date : {new Date(t.date).toLocaleString()}</div>
                        </div>
                    ))
                )}
            </div>
            <div className="group-allMembers-container">
                <h3>All Members</h3>
                <div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : members.length === 0 ? (
                        <div>No members found.</div>
                    ) : (
                        members.map((m) => (
                            <div key={m._id}>
                                <div>
                                    <strong>{m.name || 'member'}</strong>
                                </div>
                                <div>
                                    {m.email}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {showAddTxn && (
            <div className="modal-overlay" role="dialog" aria-modal="true">
                <div className="modal card">
                    <div className="card-header">
                        <h3>Add Transaction</h3>
                        <button type="button" onClick={() => setShowAddTxn(false)}>Close</button>
                    </div>
                    <form className="form" onSubmit={handleCreateTransaction}>
                        <label className="label">
                            Amount
                            <input 
                                className="input"
                                type="number"
                                value={txForm.amount}
                                onChange={(e) => setTxForm((p) => ({...p, amount: e.target.value}))}
                                placeholder="e.g. 500"
                            />
                        </label>

                        <label className="label">
                            Description
                            <input 
                                className="input"
                                value={txForm.description}
                                onChange={(e) => setTxForm((p) => ({...p, description: e.target.value}))}
                                placeholder="e.g. Dinner"
                            />
                        </label>

                        <label className="label">
                            Paid By
                            <select
                                className="input"
                                value={txForm.paidBy}
                                onChange={(e) => {
                                    console.log(e.target.value)
                                    setTxForm((p) => ({...p, paidBy: e.target.value}))
                                }}
                            >
                                <option value="">--Select--</option>
                                {members.map((m) => (
                                    <option value={m._id} key={m._id}>{m.name}</option>
                                ))}
                            </select>                            
                        </label>

                        <label className="label">
                            Split With
                            <select 
                                className="input" 
                                multiple 
                                value={txForm.splitWith} 
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
                                    setTxForm((p) => ({ ...p, splitWith: selected }))
                                }}
                            >
                                {members.map((m) => (
                                    <option value={m._id} key={m._id}>{m.name}</option>
                                ))}
                            </select>
                        </label>
                        <div className="row">
                            <button className="btn" type="submit">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )}           

    </div>

    )
}

export default Dashboard