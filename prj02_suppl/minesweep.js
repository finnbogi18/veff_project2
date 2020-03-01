var defaultBoard = {"board":{"minePositions":[[1,3],[3,0],[4,2],[4,5],[4,7],[6,9],[7,7],[8,9],[9,3],[9, 9]],"cols":"10", "rows":"10"}};
var cells = [];

function doAjax() {
    //Prepare the parameter value for 'myParam'
    var rows = document.getElementById("rows")
    var cols = document.getElementById("cols")
    var mines = document.getElementById("mines")

    var paramValue = {
        "rows":rows.value,  
        "cols":cols.value,
        "mines":mines.value
    }
    console.log(paramValue)

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
    var minefield = document.getElementById('minefield');
    minefield.innerHTML = "";
    var rows = my_data.board.rows;
    var cols = my_data.board.cols;
    var minePos = my_data.board.minePositions

    var i;
    var j;
    var cells = checkCell(rows, cols, minePos);
    console.log(cells)

    for (i = 0; i < Number(rows); i++) {
        var row = document.createElement('div')
        row.className = 'row'
        minefield.append(row)
        for (j = 0; j < Number(cols); j++) {
            var col = document.createElement('button')
            var pos = [i, j]
            console.log(i, j)
            col.value = pos
            col.className = 'col'
            col.addEventListener("click", onClick);
            col.addEventListener("contextmenu", onRightClick);
            col.id = String(pos)
            row.append(col)
        };        
    };
};

function onClick() {
    var pos = this.value
    var one = Number(pos[0])
    var two = Number(pos[2])
    if (cells[one][two] === 9) {
        this.className = 'col bomb';
        finishGame(false)
    } else if (cells[one][two] === 0) {
        this.className = 'col empty'
    } else {
        this.className = 'col empty'
        console.log(pos)
        var test = cells[one][two]
        console.log(test)
        this.innerHTML = String(test)
        this.disabled = true
    }
};

function recursive_open(x, y) {
    if (cells[x][y] == 0) {
        for (n = height - 1; n < height + 2; n++) {
            for (k = width -1; k < width + 2; k++) {
                if (cells[n][k] == 0) {
                    
                    recursive_open(n, k)
                };
            };
        };
    };
};

function onRightClick(e) {
    e.preventDefault()
    var pos = this.value
    this.innerHTML = "<img src=flag.png></img>"
};

function checkCell(rows, cols, mines) {
    cells = []
    for (i = 0; i < Number(rows); i++) {
        var rows_list = []
        for (j = 0; j < Number(cols); j++) {
            var num_mines = 69
            num_mines = check_mines(i, j, mines)
            rows_list.push(num_mines)
        };
        cells.push(rows_list)

    };
    return cells
};

function check_mines(height, width, mines) {
    var counter = 0
    var bomb = 9
    for (n = height - 1; n < height + 2; n++) {
        for (k = width -1; k < width + 2; k++) {
            for (l = 0; l < mines.length; l++) {
                if ((mines[l][0]===n) && (mines[l][1]===k)) {
                    var counter = counter + 1
                } else if ((mines[l][0] === height) && (mines[l][1] === width)) {
                    return bomb 
                }
            };
        };
    };
    return counter
    
};

function finishGame(booleanValue) {
    console.log('eg er i finishgame')
    console.log(booleanValue)
    if (booleanValue) {
        console.log('you lose nerd', minefield)
    } else {
        var test = document.getElementById('minefield').getElementsByClassName('row');
        var test2 = test.
        console.log('you lose nerd', minefield)
    };
    console.log('eftir if')
};

displayBoard(defaultBoard)