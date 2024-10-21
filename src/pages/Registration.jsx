import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Registration.css';

function Registration() {
    const [players, setPlayers] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const navigate = useNavigate();
    const [polling, setPolling] = useState(null);

    useEffect(() => {
        const pollInterval = setInterval(() => {
            // Send a POST request to server.js every 2 seconds to update the game status as 'not started'
            fetch('http://localhost:3001/game-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 0 })  // Game not started
            })
            .then(response => response.json())
            .catch(error => console.error('Error sending status:', error));
        }, 2000);

        setPolling(pollInterval);  // Save interval ID so it can be cleared later

        return () => {
            clearInterval(pollInterval);  // Clean up: stop polling when component unmounts
        };
    }, []);  // Empty dependency array means this effect runs only once when the component mounts

    const startGame = () => {
        if (selectedPlayers.length === 2) {
            clearInterval(polling);  // Stop polling when the game starts

            // Send a POST request to server.js with game status as 'started'
            fetch('http://localhost:3001/game-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 1 })  // Game started
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);  
            })
            .catch(error => console.error('Error sending status:', error));
        } else {
            alert('Please select exactly two players to start the game.');
        }
        navigate("/spilSide");  // Navigate to the game page after starting the game
    };

    const addPlayer = () => {
        if (playerName && !players.includes(playerName)) {
            setPlayers([...players, playerName]);  // Add player to the list
            setPlayerName('');  // Clear the input field
        } else {
            alert('Please enter a unique player name.');
        }
    };

    const handleCheckboxChange = (player) => {
        const currentIndex = selectedPlayers.indexOf(player);
        if (currentIndex === -1) {
            setSelectedPlayers([...selectedPlayers, player]);  // Add player to selected list
        } else {
            // Remove player from selected list
            setSelectedPlayers(selectedPlayers.filter((p, i) => i !== currentIndex));
        }
    };

    return (
        <div className="body-registrering">
            <div className="container-registrering">
                <div className="section-registrering left-section">
                    <form className="form-registrering" onSubmit={e => e.preventDefault()}>
                        <h1 className="h1-registrering">REGISTRERING</h1>
                        <div className="inputGroup">
                            <label className="label-registrering" htmlFor="Spillere">Indtast spillernavne:</label>
                            <input type="text" className="input-registrering" id="Spillere" value={playerName} onChange={e => setPlayerName(e.target.value)} />
                        </div>
                        <button type="button" className="button-registrering1" onClick={addPlayer}>Tilføj til spillerliste</button>
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
                        className={`button-registrering2 ${selectedPlayers.length === 2 ? 'active' : ''}`}
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
