const createPlayers = (name, marker,index) => {
  return { name, marker, index };
};

const creatGameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const setBoard = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
    }
  };

  return { getBoard, setBoard };
})();

const gameController = () => {

    const player1 = createPlayers("Golu","X", 2);
    const player2 = createPlayers("Star","O" , 3);
    player1.creatGameBoard.setBoard(player1.index,player1.marker);
    player2.creatGameBoard.setBoard(player2.index,player2.marker);
  const winingCombo = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
  ];
};

