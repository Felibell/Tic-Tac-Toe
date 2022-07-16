window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    let tableRows = document.getElementById("recordRows");
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    const RecordsURL = "http://localhost:8080/api/records";



    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';
    /*
        Indexes within the board
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }
    if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }
    if (!board.includes(''))
        announce(TIE);
    }

    const saveRecordOnDB = (player1Name, player2Name, roundStatus) => {
        const params = {
            headers: {
                "content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({player1: player1Name, player2: player2Name, winner: roundStatus}),
            method: "POST"
        };

        fetch(RecordsURL, params).then((response) => {
            getAllRecords();
            return response.json();
        }).catch((err)=>{
            console.log(err);
        });
    }

    const getAllRecords = () => {

        const params = {
            headers: {
                "content-type": "application/json; charset=UTF-8"
            },
            method: "GET"
        };

        fetch(RecordsURL, params).then(async (response) => {
            const records = await response.json();
            let htmlToPresent = ``;

            for(let record of records){
                htmlToPresent += `<tr>
                <td>${record.player1}</td>
                <td>${record.player2}</td>
                <td>${record.winner}</td>
                </tr>`
            }

            tableRows.innerHTML = `<table>
            <tr>
              <th>Jugador 1</th>
              <th>Jugador 2</th>
              <th>Ganador</th>
            </tr>
            ${htmlToPresent}
          </table>`; ;

            return response.json();
        }).catch((err)=>{
            console.log(err);
        });
    }

    const announce = (type) => {
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                saveRecordOnDB(PLAYERX_WON, PLAYERO_WON, currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
                break;
                
            break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                saveRecordOnDB(PLAYERX_WON, PLAYERO_WON, currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
                break;
                
            break;
            case TIE:
                announcer.innerText = 'Tie';
                saveRecordOnDB(PLAYERX_WON, PLAYERO_WON, TIE);
        }
        announcer.classList.remove('hide');
    };
    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }
        return true;
    };
    const updateBoard =  (index) => {
        board[index] = currentPlayer;
    }
    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }
    const userAction = (tile, index) => {
        if(isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }
    
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');
        if (currentPlayer === 'O') {
            changePlayer();
        }
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    getAllRecords();

    tiles.forEach( (tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    // historyButton.addEventListener("click", () => {

    //     tableRows.style.display = tableRows.style.display == "none" ? "block" : "none" ;

    // });

    resetButton.addEventListener('click', resetBoard);
});