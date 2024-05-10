import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Registration.css';

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
        const newChecked = [...selectedPlayers];

        if (currentIndex === -1) {
            newChecked.push(player);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setSelectedPlayers(newChecked);
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
            .then(() => {
                navigate("/spilSide"); // Navigate to the game page
            })
            .catch(error => console.error('Error sending status:', error));
        } else {
            alert('Please select exactly two players to start the game.');
        }

        navigate("/spilSide"); // Navigate to the game page
    };

    return (
        <div className="container">
            <div className="right-section">
                <h1>REGISTRATION OF PLAYER NAMES</h1>
                <form onSubmit={e => e.preventDefault()}>
                    <label htmlFor="Spillere">Enter players:</label>
                    <input type="text" id="Spillere" value={playerName} onChange={e => setPlayerName(e.target.value)} />
                    <button type="button" onClick={addPlayer}>Add to player list</button>
                </form>
            </div>
            <div className="left-section">
                <h1>PLAYER OVERVIEW</h1>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>
                            {player}
                            <input
                                type="checkbox"
                                checked={selectedPlayers.includes(player)}
                                onChange={() => handleCheckboxChange(player)}
                            />
                        </li>
                    ))}
                </ul>
                <button
                    id="startSpilKnap"
                    onClick={startGame}
                    disabled={selectedPlayers.length !== 2}
                >
                    Start Game
                </button>
            </div>
        </div>
    );
}

export default Registration;
