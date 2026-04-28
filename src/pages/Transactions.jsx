import { useState, useEffect } from "react";
import API from "../api/axios";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        const {data} = await API.get('/transactions')
        setTransactions(data)
    }

    return(
        <div className="container">
            <h2>Transactions</h2>
            {transactions.map(t => (
                <div key={t._id} className="card">
                    <p>{t.description}</p>
                    <p>${t.amount}</p>
                </div>
            ))}
        </div>
    )
}