import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Groups from './pages/Groups';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard/:id" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='/groups' element={<Groups/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
