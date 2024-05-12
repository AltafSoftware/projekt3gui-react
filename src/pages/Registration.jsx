import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Registration.css'; // Import the CSS for the Registration component

function Registration() {
    // State for storing the list of players
    const [players, setPlayers] = useState([]);
    // State for storing the currently entered player name in the input field
    const [playerName, setPlayerName] = useState('');
    // State for tracking which players have been selected for the game
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    // Hook for navigation between components using React Router
    const navigate = useNavigate();
    // State for managing the reference to the polling interval
    const [polling, setPolling] = useState(null);

    // useEffect: sets up a timer that regularly updates game status to the server, and cleans the timer up when game is started.
    useEffect(() => {
        // Set up polling to send a game status of '0' to the server every 2 seconds
        const pollInterval = setInterval(() => {
            fetch('http://localhost:3001/game-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 0 })
            })
            .then(response => response.json())
            .catch(error => console.error('Error sending status:', error));
        }, 2000); // Interval time set to 2000 milliseconds (2 seconds)

        setPolling(pollInterval); // Store the interval ID for later cleanup

        return () => {
            // Clear the interval when the GamePage is loaded, to prevent memory leaks
            clearInterval(pollInterval);
        };
    }, []);

    // startGame: Initiates the game if two players are selected, sends game start status to the server, and navigates to the game page.
    const startGame = () => {
        // Check if exactly two players are selected to start the game
        if (selectedPlayers.length === 2) {
            // Clear the existing polling interval
            clearInterval(polling);

            // Send a game status of '1' to the server to indicate the game is starting
            fetch('http://localhost:3001/game-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 1 })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message); // Log the response from the server
                navigate("/spilSide"); // Navigate to the game page
            })
            .catch(error => console.error('Error sending status:', error));
        } else {
            // Alert the user if the condition of selecting exactly two players is not met
            alert('Please select exactly two players to start the game.');
        }
    };

    const addPlayer = () => {
        // Check if the playerName is not empty and not already in the players list
        if (playerName && !players.includes(playerName)) {
            setPlayers([...players, playerName]); // Add the new player to the players list
            setPlayerName(''); // Clear the input field
        } else {
            // Alert the user if the player name is not unique
            alert('Please enter a unique player name.');
        }
    };

    const handleCheckboxChange = (player) => {
        // Find the index of the player in the selectedPlayers array
        const currentIndex = selectedPlayers.indexOf(player);
        if (currentIndex === -1) {
            // If the player is not already selected, add them to the selectedPlayers list
            setSelectedPlayers([...selectedPlayers, player]);
        } else {
            // If the player is already selected, remove them from the selectedPlayers list
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
