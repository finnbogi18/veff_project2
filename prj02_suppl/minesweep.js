var defaultBoard = {"board":{"minePositions":[[1,3],[3,0],[4,2],[4,5],[4,7],[6,9],[7,7],[8,9],[9,3],[9, 9]],"cols":"10", "rows":"10"}};
var cells = [];

function doAjax() {
    //Prepare the parameter value for 'myParam'
    var rows = document.getElementById("rows")
    var cols = document.getElementById("cols")
    var mines = document.getElementById("mines")

    if (rows.value === "" || cols.value === "" || mines.value === "") {
        var paramValue = {
            "rows":"10",  
            "cols":"10",
            "mines":"10"
        }
    } else {
        var paramValue = {
            "rows":rows.value,  
            "cols":cols.value,
            "mines":mines.value
        }
    };


    //The URL to which we will send the request
    var url = 'https://veff213-minesweeper.herokuapp.com/api/v1/minesweeper';

    //Perform an AJAX POST request to the url, and set the param 'myParam' in the request body to paramValue
    axios.post(url, paramValue)
        .then(function (response) {
            //When successful, print 'Success: ' and the received data
            console.log("Success", response.data)
            displayBoard(response.data)
        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log(error);
            displayBoard(defaultBoard)
        })
        .then(function () {
            // This code is always executed, independent of whether the request succeeds or fails.
        });
};

function displayBoard(my_data) {
    var resultDiv = document.getElementById("result");
    resultDiv.hidden = true
    var minefield = document.getElementById('minefield');
    //empties the minefield.
    minefield.innerHTML = ""
    var rows = my_data.board.rows;
    var cols = my_data.board.cols;
    var minePos = my_data.board.minePositions;

    var i;
    var j;
    cells = checkCell(rows, cols, minePos);

    for (i = 0; i < Number(rows); i++) {
        var row = document.createElement('div')
        row.className = 'row'
        minefield.append(row)
        //Creates the buttons for the minefield.
        for (j = 0; j < Number(cols); j++) {
            var col = document.createElement('button')
            var pos = [i, j]
            col.value = pos
            col.className = 'col'
            col.addEventListener("click", onClick)
            col.addEventListener("contextmenu", onRightClick)
            col.id = String(pos)
            row.append(col)
        }       
    }
};

function onClick() {
    /* Reveals the field that is clicked on and calls the functions needed to open 
    scan nearby field and open them too if needed. */
    var pos = this.value;
    var test = pos.split(",");
    var one = Number(test[0]);
    var two = Number(test[1]);
    if (cells[one][two] === 9) {
        this.className = 'col bomb'
        finishGame(false)
    } else if (cells[one][two] === 0) {
        recursive_open(one, two)
    } else {
        var number = cells[one][two]
        if (number === 1) {
            this.className = 'col empty one'
        } else if (number === 2) {
            this.className = 'col empty two'
        } else {
            this.className = 'col empty three'
        }
        this.innerHTML = String(number)
        this.disabled = true
    }
    if (checkWin()) {
        finishGame(true)
    }
};

function recursive_open(x, y) {
    /* This function goes recursively through all empty fields and 'opens' them.
    It opens fields that contain numbers if a empty field is neighboring it. This
    function follows the project constraints correctly by e.g. disabling open fields. */
    if (cells[x][y] == 0) {
        var n;
        var k;
        for (n = x - 1; n < x + 2; n++) {
            for (k = y - 1; k < y + 2; k++) {
                var n_str = String(n)
                var k_str = String(k)
                var id_str = n_str + "," + k_str;
                var box = document.getElementById(id_str)
                if ((n < 0) || (k < 0) || (k > Number(cols.value) - 1) || (n > Number(rows.value) - 1)) {
                } else if ((cells[n][k] == 0) && (box.className == 'col')) {
                    box.className = 'col empty';
                    box.disabled = true
                    recursive_open(n, k)
                } else if ((cells[n][k] > 0) && (cells[n][k] < 9) && (box.className == 'col')) {
                    var number = cells[n][k];
                    if (number === 1) {
                        box.className = 'col empty one'
                    } else if (number === 2) {
                        box.className = 'col empty two'
                    } else {
                        box.className = 'col empty three'
                    }
                    box.innerHTML = String(number)
                    box.disabled = true
                }
            }
        }
    }
};

function onRightClick(e) {
    /* Flags the cell and unflags it if it's already flagged,
    removes the ability to click on the cell if it's flagged. */
    e.preventDefault()
    if (this.className === "col flagged") {
        this.className = "col"
        this.addEventListener("click", onClick)
        this.innerHTML = ""
    } else {
        this.innerHTML = "<img src=flag.png></img>"
        this.removeEventListener("click", onClick)
        this.className = "col flagged"
    }
    if (checkWin()) {
        finishGame(true)
    }

};

function checkCell(rows, cols, mines) {
    /* Creates an array of the board with the value of each position
    at the correct index. */
    cells = [];
    for (i = 0; i < Number(rows); i++) {
        var rows_list = []
        for (j = 0; j < Number(cols); j++) {
            var num_mines;
            num_mines = check_mines(i, j, mines)
            rows_list.push(num_mines)
        }
        cells.push(rows_list)

    }
    return cells
};

function check_mines(height, width, mines) {
    /* Checks each position on the board and if any bombs are near,
    marks the position with the number of nearby bombs, or marks it as a bomb
    if that position is a bomb. */
    var counter = 0;
    var bomb = 9;
    for (n = height - 1; n < height + 2; n++) {
        for (k = width -1; k < width + 2; k++) {
            for (l = 0; l < mines.length; l++) {
                if ((mines[l][0]===n) && (mines[l][1]===k)) {
                    var counter = counter + 1;
                } else if ((mines[l][0] === height) && (mines[l][1] === width)) {
                    return bomb 
                }
            }
        }
    }
    return counter
    
};

function finishGame(booleanValue) {
    /* Adjusts to the board to the correct state if the player has won
    or lost the game. */

    var tempBoard = document.getElementById('minefield');
    var tempRows = tempBoard.getElementsByClassName('row');
    var resultDiv = document.getElementById("result");

    if (booleanValue) {
        for (i = 0; i < tempRows.length; i++) {
            var buttons = tempRows[i].getElementsByTagName('button')
            for (j = 0; j < buttons.length; j++) {
                buttons[j].disabled = true //Disables all the buttons on the board.
                if (cells[i][j] != 9) {
                    var number = cells[i][j]
                    if (number === 1) {
                        buttons[j].className = 'col empty one win';
                    } else if (number === 2) {
                        buttons[j].className = 'col empty two win'
                    } else {
                        buttons[j].className = 'col empty three win'
                    }
                }
            }
        }
        resultDiv.innerHTML = "You win!"
        resultDiv.hidden = false
        resultDiv.className = "winner"
        
    } else { //Reveals all of the bombs and disabled the board.
        for (i = 0; i < tempRows.length; i++) {
            buttons = tempRows[i].getElementsByTagName('button')
            for (j = 0; j < buttons.length; j++) { 
                if (cells[i][j] === 9) {
                    buttons[j].className = "col bomb"
                    buttons[j].innerHTML = "<img src=bomb.png></img>"
                }
                buttons[j].disabled=true
            }
        }

        resultDiv.innerHTML = "You lost!"
        resultDiv.hidden = false
        resultDiv.className = "loser"
    }
};

function checkWin() {
    /* Checks every button to see if it's in the correct state for a win, 
    returns true if the player has won. */
    var status = true;
    var i;
    var j;
    for (i = 0; i < cells.length; i++) {
        for (j = 0; j < cells[i].length; j++) {
            var temp_id = String(i) + "," + String(j);
            var tempButton = document.getElementById(temp_id);
            if ((cells[i][j] === 0) && (tempButton.className != "col empty")) {
                status = false
            } else if (cells[i][j] === 1) {
                if (tempButton.className != "col empty one") {
                    status = false
                };
            } else if (cells[i][j] === 2) {
                if (tempButton.className != "col empty two") {
                    status = false
                };
            } else if ((cells[i][j] >= 3) && (cells[i][j] < 9)) {
                if (tempButton.className != "col empty three") {
                    status = false
                }
            } else if (cells[i][j] === 9) {
                if (tempButton.className != "col flagged") {
                    status = false 
                }
            }
        }
    }
    return status
};

//Runs the default board when the site is loaded.
displayBoard(defaultBoard);