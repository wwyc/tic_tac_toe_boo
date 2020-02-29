import React from 'react';
import './App.css';
import Game from './components/Game';
//import endGame from './data/tic-tac-toe-end_game.json'

function App() {
  return (
      <div className="App">
          <div id="head">
            Tic Tac Toe Game
          </div>
          <Game />
    </div>

  );
}

export default App;
