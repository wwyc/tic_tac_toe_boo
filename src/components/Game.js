import React, { Component } from 'react';
import Board from './Board';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xIsNext: true,
            stepNumber: 0,
            history: [
                { squares: Array(9).fill(null) }
            ],
            scores: {X:0, O:0},
            winner: {player: null, line: null},
            gameHistory : null
        }
        this.setGameHistory();
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2)===0,
            winner: {player: null, line: null}
        })
    }

    updateScore(winner, winningline){

      const scoreHistory = this.state.scores

      let x_scores = scoreHistory['X']
      let y_scores = scoreHistory['O']

       if (winner === 'X'){
        x_scores = scoreHistory['X'] + 1
       } else {
        y_scores = scoreHistory['O'] + 1
       }

       this.setState({
            scores: {X: x_scores, O:y_scores},
            winner: {player: winner, line: winningline}
         });
    }

    checkForWinner(squares){
      // Possible winning combinations
      const possibleCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      // Iterate every combination to see if there is a match
      for (let i = 0; i < possibleCombinations.length; i += 1) {
        const [a, b, c] = possibleCombinations[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          this.updateScore(squares[a], [a, b, c]);
          return { player: squares[a], line: [a, b, c] };
        }
      }

      return null;
    };

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = this.state.winner
        if (winner.player || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat({
                squares: squares
            }),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
        this.checkForWinner(squares);
    }

    resetScore() {
      this.setState({
        scores: {X:0, O:0},
      })
    }

    resetGame() {
      this.setState({
        xIsNext: true,
        stepNumber: 0,
        history: [
            { squares: Array(9).fill(null) }
        ],
        winner: {player: null, line: null}
      })
    }

    setGameHistory() {
      return fetch('http://localhost:8080')
                    .then(response => response.json())
                    .then(gameHistory => (this.setState({gameHistory: gameHistory})))
    }

    render() {
        let gameHistory = this.state.gameHistory;
        let gameHistoryList
        if (gameHistory){
          gameHistoryList = gameHistory.map((record, gameNumber) => {
                gameNumber = gameNumber + 1
                const desc = 'Player' + record['player'] + ' won game ' + record['gameNumber'];
                return (
                    <li key={desc}>
                    {desc}
                    </li>
                )
            })
        }

        const scoreHistory = this.state.scores;
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.state.winner;
        const moves = history.map((step, move) => {
            const desc = 'Go to move #' + move ;
            if (move){
              return (
                  <li key={move}>
                      <button onClick={() => { this.jumpTo(move) }}>
                          {desc}
                      </button>
                  </li>
              )
            }
            return null;
        });
        let status;
        if (winner.player) {
            status = "Winner is " + winner.player //+ " @ " + winner.line;
        } else if (!current.squares.includes(null)) {
            status = "Tie Game!";
        } else {
            status = 'Next Player is ' + (this.state.xIsNext ? 'X' : 'O');
        }

        if (status.includes("Winner") || status.includes("Tie")){
          alert(status + '.  Please click th Start The Game button to start the next game.')
        }

        let scores
        scores = "SCORES  - Player X: " + scoreHistory['X'] + "pts,   " + "Player O: " + scoreHistory['O'] + 'pts'

        return (
            <div className="game">
            <button className="start" onClick={() => this.resetGame()}> Start The Game</button >

            <div className="game-scores">
                <div>{scores}</div>
            </div>

            <button disabled={!this.state.winner} onClick={() => this.resetScore()}> Reset Scores</button >

            <div className="game-status">
                <div>{status}</div>
            </div>

                <div className="game-board" >
                    <Board winningSquares={winner.player ? winner.line : []}
                      squares={current.squares}
                      onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                <div>Move history will appear below when game begins. Click to jump to previous moves in current Game</div>
                    <ul>{moves}</ul>
                </div>

                <div className="game-history">
                    <div>Game History: </div>
                      //<ul>{gameHistoryList}</ul>
                </div>
            </div>
        )
    }
}
