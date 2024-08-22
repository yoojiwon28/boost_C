import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './App.css';
import zogakziplogo from '../assets/zogakziplogo.svg';

function App({ children }) {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/group'); 
    };

    return (
        <div className="App">
            <header className="App-header">
                <img 
                    src={zogakziplogo} 
                    alt="Logo" 
                    className="App-logo" 
                    onClick={handleLogoClick} 
                />
            </header>
            {children}
        </div>
    );
}

export default App;
