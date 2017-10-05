import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let style = props.win ? {backgroundColor: '#cccc00'} : {};
  
  return (
    <button style={style} className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i].value}
        onClick={() => this.props.onClick(i)}
        win = {this.props.squares[i].win}
      />
    );
  }

  renderBoard(rows, cols) {
    let board = [];

    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push(this.renderSquare(i*rows+j));
      }
      board.push(<div key={i} className="board-row">{row}</div>);
    }

    return board;
  }

  render() {
    return (
      <div>
        {this.renderBoard(3, 3)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: this.createSquares(9),
          moveIndex: null,
          player: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    //const squares = current.squares.slice();
    const squares = current.squares.map(a => ({...a}));
    
    if (calculateWinner(squares) || squares[i].value) {
      return;
    }
    squares[i].value = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          move: "(" + i % 3 + "," + Math.floor(i / 3) + ")",
          player: squares[i].value,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  handleToggle() {
    this.setState({
      sortAscending: !this.state.sortAscending
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  createSquares(num) {
    let squares = new Array(num);

    for (var i = 0; i < squares.length; i++) {
      squares[i] = {
        value:null, 
        win: false,
      };
    }

    return squares;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winningLine = calculateWinner(current.squares);
    const winner = winningLine ? current.player : null;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move + ': ' + step.player + " moved to " + step.move:
        'Game start';

      const style = move === this.state.stepNumber ? {fontWeight:'bold'} : {};

      return (
        <li key={move}>
          <button style={style} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    let list;
    if (this.state.sortAscending) {
      list = <ol>{moves}</ol>;
    } else {
      list = <ol reversed>{moves.reverse()}</ol>;
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.handleToggle()}>Sort: {this.state.sortAscending ? 'Ascending' : 'Descending'}</button></div>
          {list}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
      squares[a].win = squares[b].win = squares[c].win = true;
      return lines[i];
    }
  }
  return null;
}

