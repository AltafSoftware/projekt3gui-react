import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Registration.css'; // Ensure this path is correct

function Registration() {
    const [players, setPlayers] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const navigate = useNavigate();

    const addPlayer = () => {
        if (playerName && !players.includes(playerName)) {
            setPlayers([...players, playerName]);
            setPlayerName('');
        } else {
            alert('Please enter a unique player name.');
        }
    };

    const handleCheckboxChange = (player) => {
        const currentIndex = selectedPlayers.indexOf(player);
        if (currentIndex === -1) {
            setSelectedPlayers([...selectedPlayers, player]);
        } else {
            setSelectedPlayers(selectedPlayers.filter((p, i) => i !== currentIndex));
        }
    };

    const startGame = () => {
        if (selectedPlayers.length === 2) {
            fetch('http://localhost:3001/game-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 1 })
            })
            .then(response => response.json())
            .catch(error => console.error('Error sending status:', error));
        } else {
            alert('Please select exactly two players to start the game.');
        }
        navigate("/spilSide"); // Navigate to the game page
    };

    return (
        <div className="body-registrering">

            <div className="container-registrering">

                <div className="section-registrering left-section">
                    <h1 className="h1-registrering">REGISTRERING</h1>
                    <form onSubmit={e => e.preventDefault()}>
                        <label className="label-registrering" htmlFor="Spillere">Indtast spillernavne:</label>
                        <input type="text" className="input-registrering" id="Spillere" value={playerName} onChange={e => setPlayerName(e.target.value)} />
                        <button type="button" className="button-registrering" onClick={addPlayer}>Tilføj til spillerliste</button>
                    </form>
                </div>

                <div className="section-registrering right-section">
                    <h1 className="h1-registrering">SPILLEROVERSIGT</h1>
                    <ul className="ul-registrering">
                        {players.map((player, index) => (
                            <li className="li-registrering" key={index}>
                                {player}
                                <input type="checkbox" checked={selectedPlayers.includes(player)} onChange={() => handleCheckboxChange(player)}/>
                            </li>
                        ))}
                    </ul>
                    <button 
                        id="startSpilKnap-registrering" 
                        className={`button-registrering ${selectedPlayers.length === 2 ? 'active' : ''}`}
                        onClick={startGame}
                        disabled={selectedPlayers.length !== 2}
                        >
                        Start spil
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Registration;
