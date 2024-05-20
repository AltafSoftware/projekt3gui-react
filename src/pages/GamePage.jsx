import React, { useState, useEffect } from 'react';
import '../styles/GamePage.css';
import axios from 'axios';

function GamePage() {
    const [showWelcome, setShowWelcome] = useState(true);
    const [showReady, setShowReady] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [timerCount, setTimerCount] = useState(5);
    const [showResults, setShowResults] = useState(false);
    const [showDrinkNow, setShowDrinkNow] = useState(false);
    const [player1Time, setPlayer1Time] = useState('TID');
    const [player2Time, setPlayer2Time] = useState('TID');
    const [winnerTime, setWinnerTime] = useState('TID');

    useEffect(() => {
        setTimeout(() => {
            setShowWelcome(false);
            setShowReady(true);
            setTimeout(() => {
                setShowReady(false);
                setShowTimer(true);
                startTimer();
            }, 2000);
        }, 2000);
    }, []);

    function startTimer() {
        let count = 5;
        setTimerCount(count);
        const interval = setInterval(() => {
            if (count > 1) {
                count -= 1;
                setTimerCount(count);
            } else {
                clearInterval(interval);
                setShowTimer(false);
                setShowDrinkNow(true);
                setTimeout(() => {
                    setShowDrinkNow(false);
                    setShowResults(true);
                }, 2000);
                setTimerCount(count - 1);
            }
        }, 1000);
    }

    async function getPlayer1Time() {
        try {
            const response = await axios.get('http://172.20.10.8:8080/get_time_player1');
            setPlayer1Time(response.data.player_1_time);  // Fixed data key
        } catch (error) {
            console.error('Error fetching player 1 time:', error);
        }
    }

    async function getPlayer2Time() {
        try {
            const response = await axios.get('http://172.20.10.8:8080/get_time_player2');
            setPlayer2Time(response.data.player_2_time);  // Fixed data key
        } catch (error) {
            console.error('Error fetching player 2 time:', error);
        }
    }

    async function getWinnerTime() {
        try {
            const response = await axios.get('http://172.20.10.8:8080/get_time_winner');
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
                        <p className="results-info">{winnerTime} sekunder</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GamePage;