import React, { useState, useEffect } from 'react';
// import '../styles/GamePage.css'; // Assuming the CSS file is correctly named and in the correct directory

function GamePage() {
    const [showWelcome, setShowWelcome] = useState(true);
    const [showReady, setShowReady] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [timerCount, setTimerCount] = useState(5);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowWelcome(false);
            setShowReady(true);
            setTimeout(() => {
                setShowReady(false);
                startTimer();
            }, 3000);
        }, 3000);
    }, []);

    function startTimer() {
        setShowTimer(true);
        const interval = setInterval(() => {
            setTimerCount(prevCount => {
                if (prevCount > 1) {
                    return prevCount - 1;
                } else {
                    clearInterval(interval);
                    setShowTimer(false);
                    setTimeout(() => {
                        setShowResults(true);
                    }, 2000);
                    return "DRIK!";
                }
            });
        }, 1000);
    }

    return (
        <div>
            {showWelcome && <h1 id="welcomeMessage">Velkommen til spilsiden!</h1>}
            {showReady && <h1 id="readyMessage">Klar til at drikke?</h1>}
            {showTimer && <div id="timerDisplay">{timerCount}</div>}

            {showResults && (
                <div id="tiderBoxContainer">
                    <div id="tiderBoxes">
                        <div id="tiderBox1">
                            <h2>Tid for spiller 1</h2>
                            <p>Venter på tid...</p>
                        </div>
                        <div id="tiderBox2">
                            <h2>Tid for spiller 2</h2>
                            <p>Venter på tid...</p>
                        </div>
                    </div>
                    <div id="resultatBox">
                        <h2>Resultat</h2>
                        <p>SPILLERNAVN, med tiden: TID-FUNKTION</p>
                        <p>har vundet!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GamePage;
