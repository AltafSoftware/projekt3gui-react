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
        // Defines a useEffect hook that sets up a side effect in the component.
    
        // Set up polling to send a game status of '0' to the server every 2 seconds
        const pollInterval = setInterval(() => {
            // Creates a repeating interval that executes the enclosed function every 2000 milliseconds (2 seconds).
    
            fetch('http://localhost:3001/game-status', {
                method: 'POST',               // Specifies the HTTP method POST to send data to the server.
                headers: {
                    'Content-Type': 'application/json'  // Sets the content type of the request to JSON, telling the server to expect JSON data.
                },
                body: JSON.stringify({ status: 0 })  // Converts the object { status: 0 } into a JSON string and sets it as the request body.
            })
            .then(response => response.json())  // Waits for the response from the server and converts it from JSON to a JavaScript object.
            .catch(error => console.error('Error sending status:', error));  // Catches and logs any errors that occur during the fetch operation.
        }, 2000); // Interval time set to 2000 milliseconds (2 seconds)
    
        setPolling(pollInterval); // Stores the interval ID returned by setInterval in the polling state variable for later reference.
    
        return () => {
            // Defines a cleanup function that will be called when the component is unmounted from the React DOM.
    
            // Clear the interval when the GamePage is loaded, to prevent memory leaks
            clearInterval(pollInterval);  // Clears the interval associated with the pollInterval ID, stopping the repeated execution.
        };
    }, []); // The empty dependency array indicates this effect runs only once after the initial render, mimicking componentDidMount behavior.
    

    // startGame: Initiates the game if two players are selected, sends game start status to the server, and navigates to the game page.
    const startGame = () => {
        // Check if exactly two players are selected to start the game
        if (selectedPlayers.length === 2) {
            // Clear the existing polling interval to stop repeated requests
            clearInterval(polling);
    
            // Send a game status of '1' to the server to indicate the game is starting
            fetch('http://localhost:3001/game-status', {
                method: 'POST',                          // Specifies the HTTP method POST for sending data
                headers: {
                    'Content-Type': 'application/json'   // Sets the content type of the request to JSON
                },
                body: JSON.stringify({ status: 1 })      // Converts the object { status: 1 } into a JSON string for the request body
            })
            .then(response => response.json())          // Parses the JSON response from the server
            .then(data => {
                console.log(data.message);              // Logs the message received from the server
                // navigate("/spilSide");               // Navigate to the game page, commented out for clarity
            })
            .catch(error => console.error('Error sending status:', error));  // Logs any errors encountered during the fetch
        } else {
            // Alert the user if the condition of selecting exactly two players is not met
            alert('Please select exactly two players to start the game.');
        }
        navigate("/spilSide");  // Navigate to the game page regardless of the server response or if the server is active
    };
    
    const addPlayer = () => {
        // Check if the playerName input is not empty and the name is not already in the players list
        if (playerName && !players.includes(playerName)) {
            setPlayers([...players, playerName]);       // Adds the new player to the players list
            setPlayerName('');                          // Clears the playerName input field
        } else {
            // Alert the user if the player name input is empty or the name is already taken
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
