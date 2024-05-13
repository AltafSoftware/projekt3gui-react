import React, { useState, useEffect } from 'react';
import '../styles/GamePage.css'; // Ensure this path is correct

function GamePage() {
    const [showWelcome, setShowWelcome] = useState(true);
    const [showReady, setShowReady] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [timerCount, setTimerCount] = useState(5);
    const [showResults, setShowResults] = useState(false);
    const [showDrinkNow, setShowDrinkNow] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowWelcome(false);
            setShowReady(true);
            setTimeout(() => {
                setShowReady(false);
                setShowTimer(true);
                startTimer();
            }, 2000); // Adjust time as needed
        }, 2000); // Welcome message fades out after 2 seconds
    }, []);

    function startTimer() {
        let count = 5; // Start count from 5
        setTimerCount(count); // Update the state initially to display the start count
        const interval = setInterval(() => {
            if (count > 1) {
                count -= 1; // Decrement the count
                setTimerCount(count); // Update the state with the new count
            } else {
                clearInterval(interval); // Stop the interval when count reaches 1
                setShowTimer(false);
                setShowDrinkNow(true);
                setTimeout(() => {
                    setShowDrinkNow(false);
                    setShowResults(true);
                }, 2000); // "DRINK!" message shows for 2 seconds
                setTimerCount(count - 1); // Optionally, update the count to 0
            }
        }, 1000); // Update every second
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
                            <p className="timer-info">Venter på tid...</p>
                        </div>
                        <div className="timer-box">
                            <h2 className="timer-heading">Tid for spiller 2</h2>
                            <p className="timer-info">Venter på tid...</p>
                        </div>
                    </div>
                    <div className="results-box">
                        <h2 className="results-heading">Resultat</h2>
                        <p className="results-info">SPILLERNAVN, med tiden: TID-FUNKTION har vundet!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GamePage;
