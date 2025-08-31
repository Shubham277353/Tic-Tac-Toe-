const createPlayers = (name, marker) => {
  return { name, marker };
};

const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const setBoard = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
    }
  };

  return { getBoard, setBoard };
})();

const gameController = (() => {
  const player1 = createPlayers("Golu", "X");
  const player2 = createPlayers("Star", "O");
  let currentPlayer = player1;
  let gameover = false ;

  const playRound = (index) => {
    if (gameover) return ;
    gameBoard.setBoard(index,currentPlayer.marker);
    switchPlayer();
    checkWinner();
  }


  const switchPlayer = ()=>{
    currentPlayer =  (currentPlayer === player1) ? player2 : player1;
  }

  const checkWinner = ()=>{

    const board = gameBoard.getBoard();
    const winningCombo = [
        [0,1,2],[3,4,5],[6,7,8],  //rows
        [0,3,6],[1,4,7],[2,5,8], //columns
        [0,4,8],[2,4,6]         //diagonals
    ];

    for(let combo of winningCombo){
        const a = combo[0];
        const b = combo[1];
        const c = combo[2];

        if(board[a]&&board[a]===board[b]&&board[b]===board[c]){
            console.log("Winner");
            return gameover = true;
        }
    }
  }

    return {playRound};
})();

gameController.playRound(0);
gameController.playRound(5);
gameController.playRound(2);
gameController.playRound(6);
gameController.playRound(1);
gameController.playRound(2);

console.log(gameBoard.getBoard());

