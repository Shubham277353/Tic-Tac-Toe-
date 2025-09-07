/* This module is for player creation.
 * This module returns player and marker as objects
 */

const createPlayers = (name, marker) => {
  return { name, marker };
};

/**
 * This module is for adding the gameboard.
 * This module stores game board in the form of an array.
 * It returns getBoard(),setBoard() and reset() as objects.
 */

const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const setBoard = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
    }
  };
  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setBoard, reset };
})();

/**
 * This is the game controller module it controls the flow of the game
 * This contain playRound function which plays the game and checks winner
 * It contains switchPlayer() which switches player after every move.
 * it also contains checkwinner function which checks the winner of the game with prestored board postions if even one set of positions of the stored matches with the gameBaoard the winner is decided otherwise its a draw.
 */

const gameController = (() => {
  const player1 = createPlayers("Golu", "X");
  const player2 = createPlayers("Star", "O");
  let currentPlayer = player1;
  let gameover = false;
  const cells = document.querySelectorAll(".cells");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      playRound(index);
    });
  });

  const playRound = (index) => {
    if (gameover) return;
    gameBoard.setBoard(index, currentPlayer.marker);
    if (cells[index].textContent === "") {
      cells[index].textContent = currentPlayer.marker;
    }
    checkWinner();
    switchPlayer();
    console.log(gameBoard.getBoard());
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const board = gameBoard.getBoard();
    const winningCombo = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], //rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], //columns
      [0, 4, 8],
      [2, 4, 6], //diagonals
    ];

    for (let combo of winningCombo) {
      const a = combo[0];
      const b = combo[1];
      const c = combo[2];

      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        console.log(`${board[a]} wins!`);
        return (gameover = true);
      }
    }

    if (board.includes("")) {
      return (gameover = false);
    } else {
      console.log("its a tie ");
      return (gameover = true);
    }
  };

  const startBtn = document.querySelector("[data-start]");
  startBtn.addEventListener("click", () => {
    resetBoard();
    
  });

  const resetBoard = () => {
    cells.forEach((resetCell) => {
      resetCell.textContent = "";
    });
    gameBoard.reset();
    console.log(gameBoard.getBoard());
  };

  return { playRound };
})();
