/* This module is for player creation.
 * This module returns player and marker as objects
 */

const createPlayers = (() => {
  let player = [];
  const getPlayer = () => player;
  const setPlayer = (name, markers) => {
    if (player.length >= 2) player = []; // reset if already 2
    player.push({ name, markers , score: 0 });
  };

  const setAi = (markers) => {
    if (player.length >= 2) player = [];
    player.push({ name: "Ai", markers });
  };
  
  const setScore = (index)=>{
    player[index].score += 1 ;
  }

  return { getPlayer, setPlayer, setAi , setScore };
})();

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

  const getEmptyCell = () => {
    return board
      .map((cell, index) => (cell === "" ? index : null))
      .filter((i) => i !== null);
  };

  return { getBoard, setBoard, reset, getEmptyCell };
})();

/**
 * player setup module section , in this the players name and marker are set.
 * this returns the players and markers.
 */

const playerSetupScreen = document.querySelector(".player-setup-screen");

const playersDetails = (() => {
  let numberOfPlayers = 2;
  const setNumberOfPlayers = (number) => {
    numberOfPlayers = number;
  };
  const gameContainer = document.querySelector(".game-container");
  const playerMarker = document.querySelectorAll(".marker");

  playerMarker.forEach((marker) => {
    marker.addEventListener("click", () => {
      if (numberOfPlayers === 2) {
        const player1Name =
          document.querySelector("#p1-name").value.trim() || "Player 1";
        const player2Name =
          document.querySelector("#p2-name").value.trim() || "Player 2";
        let chosenMarker = marker.dataset.mark;
        let player1Marker = chosenMarker;
        let player2Marker = chosenMarker === "X" ? "O" : "X";

        createPlayers.setPlayer(player1Name, player1Marker);
        createPlayers.setPlayer(player2Name, player2Marker);
      } else if (numberOfPlayers === 1) {
        const player1Name =
          document.querySelector("#p1-name").value.trim() || "Player 1";
        let chosenMarker = marker.dataset.mark;
        let player1Marker = chosenMarker;
        let player2Marker = chosenMarker === "X" ? "O" : "X";
        createPlayers.setPlayer(player1Name, player1Marker);
        createPlayers.setAi(player2Marker);
      }

      console.log("Players after marker clicked:", createPlayers.getPlayer());

      playerSetupScreen.style.display = "none";
      gameContainer.style.display = "flex";
      gameController();
    });
  });
  return { setNumberOfPlayers };
})();

/**
 * This is the game controller module it controls the flow of the game
 * This contain playRound function which plays the game and checks winner
 * It contains switchPlayer() which switches player after every move.
 * it also contains checkwinner function which checks the winner of the game with prestored board postions if even one set of positions of the stored matches with the gameBaoard the winner is decided otherwise its a draw.
 */

const gameController = () => {
  let gameover = false;

  const display = document.querySelector("[data-display]");
  const playerArray = createPlayers.getPlayer();

  // if (playerArray.length < 2) {
  //   console.error("Players not initialized yet!");
  //   return {};
  // }

  let player1 = playerArray[0];
  let player2 = playerArray[1];
  let currentPlayer = player1;
  display.textContent = `${currentPlayer.name}'s Turn`;

  const playRound = (index) => {
    if (gameover) {
      display.textContent = "START THE GAME TO PLAY";
      return;
    }
    gameBoard.setBoard(index, currentPlayer.markers);

    if (cells[index].textContent === "") {
      cells[index].textContent = currentPlayer.markers;
      cells[index].classList.add(currentPlayer.markers.toLowerCase());
      checkWinner();
      switchPlayer();
      console.log(gameBoard.getBoard());
    }
  };

  const cells = document.querySelectorAll(".cells");
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      playRound(index);
    });
  });

  // this function contains the switch player logic
  // current player is Ai , it will choose random index and pass it to the playround function

  const switchPlayer = () => {
    if (gameover) return;
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    display.textContent = `${currentPlayer.name}'s Turn`;

    if (currentPlayer.name === "Ai") {
      let emptyCells = gameBoard.getEmptyCell();
      let randomIndex = Math.floor(Math.random() * emptyCells.length);
      if (emptyCells.length !== 0) {
        setTimeout(() => playRound(emptyCells[randomIndex]), 200);
      }
    }
  };

  //This function as the name suggests checks the winner according to the preset winning combos.

  const checkWinner = () => {
    const board = gameBoard.getBoard();
    const winningCombo = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let [a, b, c] of winningCombo) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        display.textContent = `${currentPlayer.name} wins!`;
        if(currentPlayer === player1){
          createPlayers.setScore(0);
        }else{
          createPlayers.setScore(1);
        }
        console.log(createPlayers.getPlayer());
        showDialog(currentPlayer.name, false);
        gameover = true;
        return;
      }
    }

    if (!board.includes("")) {
      display.textContent = "It's a tie!";
      showDialog(null, true);
      gameover = true;
    }
  };

  // dialog box opens when either player wins.
  // displays play again and home buttons .

  const dialog = document.querySelector("#dialog");
  const playAgain = document.querySelector("#play-again-btn");
  const homeBtn = document.querySelector("#home-btn");
  const gameContainer = document.querySelector(".game-container");

  playAgain.addEventListener("click", () => {
    stopConfetti();
    resetBoard();
    dialog.close();
  });

  homeBtn.addEventListener("click", () => {
    stopConfetti();
    resetBoard();
    gameContainer.style.display = "none";
    gameMode.style.display = "flex";
    dialog.close();
  });

  const showDialog = (name, flag) => {
    const winningText = document.querySelector(".win-text");
    const text = document.querySelector(".text");

    if (!flag) {
      winningText.textContent = `${name} Won`;
      celebrateWin();
    } else {
      text.textContent = "Ohh!!!";
      winningText.textContent = `It's a tie`;
    }
    dialog.showModal();
  };

  const resetBoard = () => {
    cells.forEach((resetCell) => {
      resetCell.textContent = "";
      resetCell.classList.remove("x", "o");
    });
    gameBoard.reset();
    gameover = false;
    currentPlayer = player1;
    display.textContent = `${currentPlayer.name}'s Turn`;
  };

  return { playRound };
};

const startSinglePlayer = () => {
  const secondPlayerName = document.querySelector("#p2-name");
  secondPlayerName.style.display = "none";
  playersDetails.setNumberOfPlayers(1);
};

/**
 * This section contain the game mode screen DOM and logic.
 * It handles three screens in total : gamemode , playerChoice and the main gameBoard.
 */

const gameMode = document.querySelector(".game-mode-choice-screen");
const modes = document.querySelectorAll(".players");

modes.forEach((mode) => {
  mode.addEventListener("click", () => {
    const selectedMode = mode.dataset.choice;
    gameMode.style.display = "none";
    playerSetupScreen.style.display = "flex";
    if (selectedMode === "1") {
      console.log(selectedMode);
      startSinglePlayer();
    }
  });
});

//shows confetti

let confettiActive = false;

function celebrateWin() {
  confettiActive = true;

  var duration = 3 * 1000;
  var end = Date.now() + duration;

  (function frame() {
    if (!confettiActive) return;

    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function stopConfetti() {
  confettiActive = false;
  if (confetti.reset) confetti.reset();
}