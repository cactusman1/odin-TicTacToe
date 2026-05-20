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
        else console.log("WALLAHI IT IS AN INVALID MOVE");
    }

    // finally the function to print the board. which'll be called
    // after every move
    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };

    return { markCell, printBoard, getBoard }
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

    const getValue = () => value;

    return {
        mark,
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

    let activePlayer = players[0];

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
        for(let j = 0; j <= 3; j++){
            for(let k = 0; k <= 3; k++){
                if (board[j][k] && !winCondition(board)){
                    console.log("Tis a tie");
                } 
            }
        }
    }

    const playRound = (row, column) => {
        console.log(`Marking ${getActivePlayer().name}'s cell`);
        board.markCell(row, column, getActivePlayer().mark);

        //This is where i'll check the win condition
        if (winCondition(board.getBoard())) {
            console.log(`${getActivePlayer().name} wins`)
            return;
        }
        else{
            tieCondition(board.getBoard());
            return;
        }


        switchActivePlayer();
        printNewRound();
    }
    // initial board
    printNewRound();

    return {
        playRound
    };
}

const game = gameController();
