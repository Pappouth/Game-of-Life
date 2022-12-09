document.getElementById("gridSize").onclick = buildTable;
document.getElementById("fill").onclick = fillTable;
document.getElementById("clear").onclick = clearTable;
document.getElementById("game").onclick = start;


var tableContainer;
var table;
var oldStates;

var interval;
var timer = 60;


/**
 * Crée un tableau HTML
 */
function buildTable() {
    col = parseInt(document.getElementById("heigth").value, 10);
    row = parseInt(document.getElementById("width").value, 10);
    
    tableContainer = document.getElementById("tableContainer");
    table = document.createElement("table");
    table.id = "table";

    for(var i = 0; i < col; i++) {
        var tr = document.createElement("tr");
        for(var j = 0; j < row; j++) {
            var td = document.createElement("td"); // cellule
            td.setAttribute("id", i+" "+j);
            td.setAttribute("id", `${i} ${j}`);
            td.setAttribute("class", "dead");
            td.onclick = clickCell;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    
    if(!tableContainer.hasChildNodes()) {
        tableContainer.appendChild(table);
    } else {
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    }
}

/**
 * Permet de changer l'état d'une cellule, en cliquant dessus
 */
function clickCell() {
    if(this.className == "alive") {
        this.setAttribute("class", "dead");
    } else if(this.className == "dead") {
        this.setAttribute("class", "alive");
    }
}

/**
 * Remplit le tableau HTML
 */
function fillTable() {
    pause();

    if(!tableContainer.hasChildNodes()) {
        var error = document.createElement("p");
        error.innerHTML = "Tableau inexistant 😱";
        tableContainer.appendChild(error);
        return;
    }

    for(var i = 0; i < col; i++) {
        for(var j = 0; j < row; j++) {
            var cell = table.children[i].children[j];
            var randState = Math.random() < 0.5;
            if(randState) {
                cell.setAttribute("class", "alive");
            } else {
                cell.setAttribute("class", "dead");
            }
        }
    }
}

/**
 * Vide le tableau
 */
function clearTable() {
    pause();
    
    for(var i = 0; i < col; i++) {
        for(var j = 0; j < row; j++) {
            cell = table.children[i].children[j].setAttribute("class", "dead");
        }
    }
}


// ---------- LE JEU ----------
/**
 * Stocke l'état initial des cellules
 */
function stockCurCellState() {
    oldStates = [];
    for(var i = 0; i < row; i++) {
        oldStates.push([]);
        for(var j = 0; j < col; j++) {
            var cell = table.children[j].children[i];
            oldStates[i].push(cell.className);
        }
    }
}

/**
 * Calcule l'état suivant des cellules
 */
function calculateNextStates() {
    stockCurCellState();
    for(var i = 0; i < col; i++) {
        for(var j = 0; j < row; j++) {
            var statesArr = [];
            var curCell = table.children[i].children[j];

            var borders = [i-1, i+1, j-1, j+1];
            if(borders[0] == -1) borders[0] = 0;
            if(borders[1] == col) borders[1] = col-1;
            if(borders[2] == -1) borders[2] = 0;
            if(borders[3] == row) borders[3] = row-1;

            for(var k = borders[0]; k <= borders[1]; k++) {
                for(var l = borders[2]; l <= borders[3]; l++) {
                    if(!(k == i && l == j)) {
                        var test = oldStates[l][k];
                        statesArr.push(test);
                    }
                }
            }

            var aliveNeighboursCount = statesArr.filter(element => element == "alive").length;

            if(aliveNeighboursCount == 3 || (aliveNeighboursCount == 2 && curCell.className == "alive")) {
                curCell.setAttribute("class", "alive");
            } else {
                curCell.setAttribute("class", "dead");
            }

        }
    }
}

/**
 * Démarre le jeu ou le met en pause
 */
function start() {
    if(this.innerText == "Start") {
        interval = setInterval(calculateNextStates, timer);
        this.innerText = "Pause";
    } else if(this.innerText == "Pause") {
        pause();
    }
}

/**
 * Met le timer en pause
 */
function pause() {
    document.getElementById("game").innerText = "Start";
    interval = clearInterval(interval);
}

/**
 * Initialise le jeu
 */
function initialize() {
    buildTable();
}

initialize();