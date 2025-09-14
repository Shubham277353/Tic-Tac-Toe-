/**
 * This module is the player creation facotry function
 * it hides the player array from gloabal scope and only allow changes through set player array
 * it used to set a new ai player for single player mode.
 * it also sets the score of a player object and updates the dom through updateScoreBoard().
 */

const createPlayers = (() => {
  let player = [];
  const getPlayer = () => player;
  const setPlayer = (name, markers) => {
    if (player.length >= 2) player = [];
    player.push({ name, markers, score: 0, isAi: false });
  };

  const setAi = (markers) => {
    if (player.length >= 2) player = [];
    player.push({ name: "Ai", markers, score: 0, isAi: true });
    updateScoreBoard();
  };

  const setScore = (index) => {
    player[index].score += 1;
    updateScoreBoard();
  };
  const resetScore = () => {
    player.forEach((p) => {
      p.score = 0;
    });
    updateScoreBoard();
  };

  const updateScoreBoard = () => {
    const player1 = player[0] || {};
    const player2 = player[1] || {};

    const p1NameEl = document.querySelector("#player1Name");
    const p2NameEl = document.querySelector("#player2Name");
    const p1ScoreEl = document.querySelector("#player1Score");
    const p2ScoreEl = document.querySelector("#player2Score");

    if (p1NameEl) p1NameEl.textContent = player1.name || "Player 1";
    if (p2NameEl) p2NameEl.textContent = player2.name || "Player 2";

    if (p1ScoreEl) p1ScoreEl.textContent = player1.score ?? 0;
    if (p2ScoreEl) p2ScoreEl.textContent = player2.score ?? 0;
  };

  return { getPlayer, setPlayer, setAi, setScore, resetScore };
})();

/**
 * This module is for adding the gameboard.
 * This module stores game board in the form of an array.
 * it also provides emptycells array for ai player.
 * It returns getBoard(),setBoard() , getEmptyCell and reset() as objects.
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
 * this section checks for the number of players and sets the player name and marker according to that.
 * after setting the players name and marker it calso the gameController() function.
 */

const playerSetupScreen = document.querySelector(".player-setup-screen");

const playersDetails = (() => {
  let numberOfPlayers = 2;
  const setNumberOfPlayers = (number) => {
    numberOfPlayers = number;
  };
  const gameContainer = document.querySelector(".game-board");
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

      // hides the player setup screen and show the gameboard
      playerSetupScreen.style.display = "none";
      gameContainer.style.display = "flex";

      gameController();
    });
  });
  return { setNumberOfPlayers };
})();

/**
 * This is the game controller module it controls the complete flow of the game .
 * It sets the players and assign them to the currentPlayer which helps use the current player in other functions
 * This contain playRound function which plays the game and checks winner
 * It contains switchPlayer() which switches player after every move and if player isAi it plays the ai's move.
 * It also contains checkwinner function which checks the winner of the game with prestored board postions if even one set of positions of the stored matches with the gameBaoard the winner is decided otherwise its a draw.
 */

const gameController = () => {
  let gameover = false;

  const display = document.querySelector("[data-display]");
  const player1Name = document.querySelector("#player1Name");
  const playerArray = createPlayers.getPlayer();
  const player2Name = document.querySelector("#player2Name");
  let player1 = playerArray[0];
  let player2 = playerArray[1];
  let currentPlayer = player1;
  player1Name.textContent = player1.name;
  player2Name.textContent = player2.name;
  display.textContent = `${currentPlayer.name}'s Turn`;

  const playRound = (index) => {
    // if gameover is true no other cell will be clicked
    if (gameover) {
      return;
    }
    gameBoard.setBoard(index, currentPlayer.markers);

    // sets the DOM if the clicked cell is empty
    if (cells[index].textContent === "") {
      cells[index].textContent = currentPlayer.markers;
      cells[index].classList.add(currentPlayer.markers.toLowerCase());
      console.log(currentPlayer);
      checkWinner();
      switchPlayer();
      console.log(gameBoard.getBoard());
    }
  };

  //checks the index of the button clicked
  const cells = document.querySelectorAll(".cells");
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      playRound(index);
    });
  });
  
  // switch player function
  const switchPlayer = () => {
    //if game is over , players will not be switched
    if (gameover) return;
    currentPlayer = currentPlayer === player1 ? player2 : player1;

    // if current player is ai checks for available empty cells.
    // and use the index to call the play found fuction after a delay of 3ms.
    if (currentPlayer.isAi) {
      let emptyCells = gameBoard.getEmptyCell();
      let randomIndex = Math.floor(Math.random() * emptyCells.length);
      if (emptyCells.length !== 0) {
        setTimeout(() => playRound(emptyCells[randomIndex]), 300);
      }
    }
    display.textContent = `${currentPlayer.name}'s Turn`;
  };

  //This function as the name suggests checks the winner according to the preset winning combos.
  const checkWinner = () => {
    const board = gameBoard.getBoard();
    const winningCombo = [
      [0, 1, 2], [3, 4, 5],[6, 7, 8], // rows
      [0, 3, 6],[1, 4, 7],[2, 5, 8], // cols
      [0, 4, 8],[2, 4, 6], // diagonals
    ];

    for (let [a, b, c] of winningCombo) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        display.textContent = `${currentPlayer.name} wins!`;
        if (currentPlayer === player1) {
          createPlayers.setScore(0);
        } else {
          createPlayers.setScore(1);
        }
        showDialog(currentPlayer.name, false);
        gameover = true;
        console.log(createPlayers.getPlayer());
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
  const gameContainer = document.querySelector(".game-board");

  playAgain.addEventListener("click", () => {
    stopConfetti();
    resetBoard();
    dialog.close();
  });

  homeBtn.addEventListener("click", () => {
    location.reload();
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
