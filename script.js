function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }
    // getBoard is not needed for the console. 
    // It'll eventually be used for UI rendering
    const getBoard = () => board;

    const markCell = (row, column, player) => {
        // what i intend this function to do is mark the cell
        // a player chooses by taking the row, column and player
        // as input and marking that cell with the players mark (X or O)
        if (board[row][column].getValue() === "") {
            board[row][column].mark(player);
        }
        else alert("WALLAHI IT IS AN INVALID MOVE!!!");
    }

    // finally the function to print the board. which'll be called
    // after every move
    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };

    const resetBoard = () => {
        board.length = 0;
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }

    }

    return { markCell, printBoard, getBoard, resetBoard }
};

/*
The Cell function is pushed to the "board" array and mark X or O depending
on the "player" variable. 
*/
function Cell() {
    let value = "";

    const mark = (player) => {
        value = player;
    }
    // For when the restart button is clicked. It will clear thep
    const clearMark = () => {
        value = "";
    }
    const getValue = () => value;

    return {
        mark,
        clearMark,
        getValue,
    };
}

function gameController() {
    const board = gameBoard();

    const players = [
        {
            name: "Player One",
            mark: 'X'
        },

        {
            name: "Player Two",
            mark: 'O'
        }
    ]

    const changePlayerOneName = (name) => {
        players[0].name = name;
    }

    const changePlayerTwoName = (name) => {
        players[1].name = name;
    }
    let activePlayer = players[0];

    const switchToPlayerOne = () => {
        activePlayer = players [0];
    }

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s  turn`)
    }

    const winCondition = (board) => {
        const allX = (line) => line.every((cell) => cell.getValue() == 'X');
        const allO = (line) => line.every((cell) => cell.getValue() == 'O');

        const patternCheck = [
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]]
        ]

        for (const patterns of patternCheck) {
            if (allX(patterns) || allO(patterns)) {
                return true;
            }
        }
        return false;
    }

    const tieCondition = (board) => {
        // This empty array  will take elements of the board that aren't blank/empty.
        let tieArray = [];
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if (board[j][k].getValue() == 'X' || board[j][k].getValue() == 'O') {
                    tieArray.push(board[j][k].getValue());
                }
            }
        }
        // Basically if all cells are marked with X or O
        // then the length of tieArray should be 9 
        // If its length is 9 and nobody has won then it is a tie
        if (tieArray.length == 9 && winCondition(board) == false) {
            return true;
        }
        return false;
    }

    const playRound = (row, column) => {
        console.log(`Marking ${getActivePlayer().name}'s cell`);
        board.markCell(row, column, getActivePlayer().mark);

        // I don't necessarily need to log this
        // but just in case i want to debug, it should be here.
        if (winCondition(board.getBoard())) {
            console.log(`${getActivePlayer().name} wins`);
            board.printBoard();
            return;
        }
        else if (tieCondition(board.getBoard())) {
            console.log("Tis a draw.");
            board.printBoard();
            return;
        }
        else {
            switchActivePlayer();
            printNewRound();
        }
    }
    // initial board
    printNewRound();

    const resetGame = () => {
        board.resetBoard();
        switchToPlayerOne();
    }
    
    return {
        playRound,
        getActivePlayer,
        winCondition,
        tieCondition,
        getBoard: board.getBoard,
        resetGame,
        changePlayerOneName,
        changePlayerTwoName
    };
}
function screenController (){
    const game = gameController();
    const playerTurn = document.querySelector('.playerTurn')
    const boardUI = document.querySelector('.board')

    const updateScreen = () => {

        boardUI.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurn.textContent = `${activePlayer.name}'s turn`;
        if(activePlayer.mark === 'X'){
            playerTurn.style.color = "#ff0a0a";
        } else playerTurn.style.color = "#0057ff";

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add('.cell');

                cellButton.dataset.row = rowIndex
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                boardUI.appendChild(cellButton);
            })
            
        })
        
        if (game.winCondition(board)) {
            playerTurn.textContent = `${activePlayer.name} wins`;
            return;
        }
        else if (game.winCondition(board)) {
            playerTurn.textContent = "Tis a draw.";
            
            return;
        }
    }
    
    function clickBoardHandler(e){
        const clickedRow = e.target.dataset.row;
        const clickedColumn = e.target.dataset.column;
        if(!clickedColumn || !clickedRow) return;

        game.playRound(clickedRow, clickedColumn);
        updateScreen();
    }

    boardUI.addEventListener("click", clickBoardHandler);
    const startGame = document.querySelector(".start")
    startGame.addEventListener('click', () =>{
        updateScreen();
    })

    boardUI.addEventListener("click", clickBoardHandler);

    const restartGame = document.querySelector(".restart")
    restartGame.addEventListener('click', () =>{
        game.resetGame();
        updateScreen();
    })
    
    const input1 = document.querySelector("#playerOne");
    const playerOneName = document.querySelector(".playerOneName");
    input1.addEventListener("keydown", (e) =>{
        if(e.key === "Enter"){
            e.preventDefault();
            playerOneName.textContent = e.target.value;
            game.changePlayerOneName(e.target.value);
            e.target.value = ""

        }
    })

    const input2 = document.querySelector("#playerTwo");
    const playerTwoName = document.querySelector(".playerTwoName");
    input2.addEventListener("keydown", (e) =>{
        if(e.key === "Enter"){
            e.preventDefault();
            playerTwoName.textContent = e.target.value;
            game.changePlayerTwoName(e.target.value);
            e.target.value = "";

        }
    })

}
screenController();