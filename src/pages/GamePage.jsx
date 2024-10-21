import React, { useState, useEffect } from 'react';
import '../styles/GamePage.css';
import axios from 'axios';

function GamePage() { // Define the GamePage component
    // State variables to control different UI elements and game states
    const [showWelcome, setShowWelcome] = useState(true); 
    const [showReady, setShowReady] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [timerCount, setTimerCount] = useState(5);
    const [showResults, setShowResults] = useState(false);
    const [showDrinkNow, setShowDrinkNow] = useState(false);
    const [player1Time, setPlayer1Time] = useState('TID');
    const [player2Time, setPlayer2Time] = useState('TID');
    const [winnerTime, setWinnerTime] = useState('TID');

    useEffect(() => {  // useEffect hook to run the welcome and ready states on component load
        setTimeout(() => {  // After 2 seconds, hide the welcome message and show the "Ready" message
            setShowWelcome(false);
            setShowReady(true);
            setTimeout(() => {  // After another 2 seconds, hide the "Ready" message and show the timer
                setShowReady(false);
                setShowTimer(true);
                startTimer();  // Start the countdown timer
            }, 2000);
        }, 2000);
    }, []);  // Empty dependency array = effect runs only once when the component mounts

    /**
     * Function to start the countdown timer
     */
    function startTimer() {
        let count = 5;  // Initialize the countdown value
        setTimerCount(count);  // Set the countdown value in state
        const interval = setInterval(() => {  // Create an interval that runs every 1 second
            if (count > 1) {  // If the countdown is greater than 1
                count -= 1;  // Decrease the count by 1
                setTimerCount(count);  // Update the state with the new countdown value
            } else {  // When the countdown reaches 1
                clearInterval(interval);  // Stop the interval
                setShowTimer(false);  // Hide the timer
                setShowDrinkNow(true);  // Show the "Drink Now" message
                setTimeout(() => {  // After 2 seconds, hide the "Drink Now" message and show the results
                    setShowDrinkNow(false);
                    setShowResults(true);
                }, 2000);
                setTimerCount(count - 1);  // Set the final timer value to 0
            }
        }, 1000);  // Interval runs every 1000 milliseconds (1 second)
    }
    // TODO: FIX COMMENTS
    async function getPlayer1Time() {
        try {
            // GET REQUEST to the server to fetch the player 1 time
            const response = await axios.get('http://172.20.10.10:8080/get_time_player1');
            // Update player 1's time state with the fetched data
            setPlayer1Time(response.data.player_1_time);  // Fixed data key
        } catch (error) {
            console.error('Error fetching player 1 time:', error);
        }
    }

    async function getPlayer2Time() {
        try {
            const response = await axios.get('http://172.20.10.10:8080/get_time_player2');
            setPlayer2Time(response.data.player_2_time);  // Fixed data key
        } catch (error) {
            console.error('Error fetching player 2 time:', error);
        }
    }

    async function getWinnerTime() {
        try {
            const response = await axios.get('http://172.20.10.10:8080/get_time_winner');
            setWinnerTime(response.data.winner);  // Fixed data key
        } catch (error) {
            console.error('Error fetching winner time:', error);
        }
    }

    return (
        <div className="game-body">
            {showWelcome && <h1 className="message-welcome">Velkommen til spilsiden!</h1>}
            {showReady && <h1 className="message-ready">Klar til at drikke?</h1>}
            {showTimer && <div className={`timer-display ${showTimer ? 'show' : ''}`}>DRIK OM: {timerCount}</div>}
            {showDrinkNow && <h1 className="message-ready">DRIK!</h1>}
            {showResults && (
                <div className="results-container">
                    <div className="timer-boxes">
                        <div className="timer-box">
                            <h2 className="timer-heading">Tid for spiller 1</h2>
                            <button className="tid-buttons" onClick={getPlayer1Time}>Hent tid</button>
                            <p className="timer-info">{player1Time} sekunder.</p>
                        </div>
                        <div className="timer-box">
                            <h2 className="timer-heading">Tid for spiller 2</h2>
                            <button className="tid-buttons" onClick={getPlayer2Time}>Hent tid</button>
                            <p className="timer-info">{player2Time} sekunder.</p>
                        </div>
                    </div>
                    <div className="results-box">
                        <h2 className="results-heading">RESULTAT</h2>
                        <button className="tid-buttons" onClick={getWinnerTime}>Hent resultat</button>
                        <p className="results-info">{winnerTime} sekunder.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GamePage;