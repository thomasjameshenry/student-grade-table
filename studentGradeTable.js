var studentNames = [
    "Craig Timms",
    "Arianna Grubaugh",  
    "Delicia Traylor",  
    "Bee Rodi",  
    "Joy Dice",  
    "Erlene Lentz",  
    "Gloria Reddy",  
    "Ruth Cerniglia",  
    "Vernie Isham",  
    "Ramonita Blankenship",  
    "Modesto Dobles",  
    "Lashaunda Willmon",  
    "Shantay Irick",  
    "Margret Allsop",  
    "Robbin Lowell",  
    "Diana Kilcrease",  
    "Danette Saidi",  
    "Daina Mazer",  
    "Beverly Mazzariello",  
    "Juliette Holter",  
    "Melissia Durazo",  
    "Carroll Pea",  
    "Monte Piazza",  
    "Delcie Hardt",  
    "Dagmar Usher",  
    "Valerie Sarratt",  
    "Juli Jaggers",  
    "Ahmad Gilham",  
    "Aliza Weatherall",  
    "Lowell Peay",  
    "Hisako Mcgrory",  
    "Wade Pan",  
    "Helene Peterson",  
    "Ariana Hagstrom",  
    "Adriene Ayotte",  
    "Francie Raley",  
    "Mira Kosloski",  
    "Janina Schoonover",  
    "Thresa Wait",  
    "Teresa Faivre",  
    "Jenifer Feinberg",  
    "Debby Ruddick",  
    "Shiloh Winbush",  
    "Willetta Lange",  
    "Lily Heyward",  
    "Trey Portwood",  
    "Granville Scotti",  
    "Nery Calderone",  
    "Viviana Sklar",  
    "Tessie Rayfield" 
];
//keeps track of rows in record table
var currentRow = 0;
//keep track of rows in gradeConversion table
var currentGradeRow = 0;
//counts number of iterations of addRow function
var tapCount = 0;
//stores values from Average (%) column
var avgArray = [];
//stores the selected grading system, Average (%) Letter Grade or Scale 4.0, the user defines
var selectedGrade = 0;
//counts number of columns begining with 7
var colNum = 7;
//stores values for Letter Grade
var grade1 = [];
//stores values for Scale 4.0
var grade2 = [];
//stores the state of table before addCol, addRow, delCol or delRow functions are called
var savedTable = [];

//builds tavle on window load - https://www.w3schools.com/tags/ev_onload.asp
window.onload = fillTable;
//generates random name from studentNames array
function getRandomName() {
    return studentNames[Math.floor(Math.random() * 50)];
}
//generates a random 8 digit student ID number
function getRandomID() {
    return Math.floor(Math.random() * 99999999) + 10000000;
}
//builds the table on load by adding 9 more rows and also hides toggle gradeConversion table
function fillTable() {
    var gradeTable = document.getElementById("gradeConversion");
    gradeTable.style.display = "none";
    for (var x = 0; x < 9; x++) {
        addRow(false);
    }
}
//function adds rows to table on load and can also be called to add individual rows from button press
function addRow(bool) {
    save();
    var table = document.getElementById("record");
    var row = table.insertRow(currentRow + 2);
    currentRow++;

    var cell;
    for (var k = 0; k <= 7; k++) {
        cell = row.insertCell(k);
        if (k == 0) {
            cell.innerHTML = getRandomName();
        } else if (k == 1) {
            cell.innerHTML = getRandomID();
        } else if (k >= 2 & k <= 6) { //if cell is within an assignment column
            cell.innerHTML = "-"; // "-" as default
            cell.style.textAlign = "center";// - aligns text
            cell.setAttribute('contentEditable', 'true'); //cells are editable - https://www.w3schools.com/jsref/prop_html_contenteditable.asp
        } else {
            cell.innerHTML = "-"; //average column
        }
    }
    notSubmitted(); //calls function to search for any unsubmitted cells
    if (bool) {
        tapCount--;
    }
    fillGradeTable(1);
}
//adds Column to record table with "Additional Assignment as the header"
function addColumn() {
    save();
    var table = document.getElementById("record");
    colNum++;
    var rowNum = table.rows[0].cells.length;

    var cell;
    var row;
    cell = table.rows[0].insertCell(rowNum - 1);
    cell.innerHTML = "Additional Assignment";
    cell.style.fontWeight = "bold";
    for (var k = 1; k <= currentRow + 1; k++) {
        row = table.rows[k];
        cell = row.insertCell(rowNum - 1);
        cell.innerHTML = "-";
        cell.style.textAlign = "center";
        cell.setAttribute('contentEditable', 'true');
    }
}
//deletes rows in tables, record and gradeConversion, with a button click
function deleteRow() {
    save();
    document.getElementById("record").deleteRow(currentRow + 1);
    currentRow--;
    document.getElementById("gradeConversion").deleteRow(currentGradeRow);
    currentGradeRow--;
    avgArray.pop();
    grade1.pop();
    grade2.pop();
}
//function deletes column in record table
function deleteColumn() {
    save();
    var table = document.getElementById("record");
    var rowNum = table.rows[0].cells.length;
    var cell;
    for (var i = 0; i <= currentRow + 1; i++) {
        table.rows[i].deleteCell(colNum - 1);
    }
    colNum--;
}
//function checks if cells are unsubmitted and changes the colour from yellow to white if they are Submitted
//function also records number of unsubmitted assignments
function notSubmitted() {
    var table = document.getElementById("record");
    var unsubCount = 0;
    for (var i = 1; i < table.rows.length; i++) {
        for (var j = 2; j < table.rows[i].cells.length - 1; j++) {
            if (table.rows[i].cells[j].innerHTML == "-") {
                table.rows[i].cells[j].style.textAlign = "center";
                unsubCount++;
                table.rows[i].cells[j].style.backgroundColor = "yellow";
            } else {
                if (i % 2 == 1) {
                    table.rows[i].cells[j].style.backgroundColor = "#f2f2f2";
                } else {
                    table.rows[i].cells[j].style.backgroundColor = "white";
                }
            }
        }
        document.getElementById("unsubmittedCount").innerHTML = unsubCount;
    }
}
//event listener - executes calPercentage for each cell when mouse is moved out of the table
//https://www.w3schools.com/jsref/event_onmouseout.asp
document.querySelectorAll('#record')
    .forEach(e => e.addEventListener("mouseout", calPercentage));
//function calculates percentage grade of each row  and displays on the right-most column of the record table
function calPercentage() {
    var table = document.getElementById("record");
    var sum = 0;
    var row = table.rows.length;
    var col = table.rows[0].cells.length;
    var currentVal = 0;
    table.rows[0].cells[col - 1].innerHTML = "Average(%)";

    for (var n = 1; n < row; n++) {
        sum = 0;
        table.rows[n].cells[col - 1].style.textAlign = "right";

        for (var m = 2; m < col - 1; m++) {
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
            currentVal = parseInt(table.rows[n].cells[m].innerHTML);
            if (isNaN(currentVal)) {
                table.rows[n].cells[m].innerHTML = '-';
                table.rows[n].cells[m].style.backgroundColor = "yellow";
            } else if (currentVal >= 0 && currentVal < 101) {
                sum += currentVal;
                table.rows[n].cells[m].style.textAlign = "right";
                table.rows[n].cells[m].style.backgroundColor = "white";
            } else {
                table.rows[n].cells[m].innerHTML = '-'
                table.rows[n].cells[m].style.backgroundColor = "yellow";
            }
        }
        sum = (sum / ((col - 3)));
        //https://www.w3schools.com/jsref/jsref_tofixed.asp
        table.rows[n].cells[col - 1].innerHTML = (sum.toFixed(0)) + "%";

        //if sum is less than 60, set background to red (not working)
        if (table.rows[n].cells[col - 1].innerHTML < 60) {
            table.rows[n].cells[col - 1].style.backgroundColor = "darkred";
        } else {
            table.rows[n].cells[col - 1].style.backgrounColor = "white";
        }
    }
    notSubmitted();
    togglePer();//calls for gradeConversion table to be populated
}
//function allows for display of gradeConversion table to be switched on and off
function showToggle() {
    var gradeTable = document.getElementById("gradeConversion");
    if (gradeTable.style.display === "none") {
        gradeTable.style.display = "inline";
    } else {
        gradeTable.style.display = "none";
    }
}
//builds gradeConversion table and calls fillCells to populate it
function togglePer() {
    var table = document.getElementById("record");
    var gradeTable = document.getElementById("gradeConversion");
    fillGradeTable(9);
    fillCells();
}
//builds gradeConversion table with num specifying the amount of rows
function fillGradeTable(num) {
    if (tapCount <= num) {
        var gradeTable = document.getElementById("gradeConversion");
        var row;
        var cell;
        row = gradeTable.insertRow(currentGradeRow + 1);
        currentGradeRow++;
        tapCount++;
        for (var k = 0; k <= 2; k++) {
            cell = row.insertCell(k);
        }
    }
}
//converts Average (%) column data in record table to Letter grade and Scale 4.0, and fills gradeConversion table
function fillCells() {
    var gradeTable = document.getElementById("gradeConversion");
    var table = document.getElementById("record");
    var col = table.rows[0].cells.length;
    var cell;
    var current;
    avgArray = [];
    var arrayVar;
    for (var t = 1; t < currentRow + 2; t++) {
        cell = table.rows[t].cells[col - 1];
        avgArray.push(cell.innerHTML);
    }

    for (var rowIndex = 0; rowIndex < currentGradeRow; rowIndex++) {
        for (var colIndex = 0; colIndex <= 2; colIndex++) {
            current = gradeTable.rows[rowIndex + 1].cells[colIndex];
            arrayVar = avgArray[rowIndex];
            if (colIndex == 0) {
                current.innerHTML = avgArray[rowIndex];
                table.rows[rowIndex].cells[col-1].style.backgrounColor = "red";
            }
            if (colIndex == 1) {
                if (selectedGrade == 0) {
                    if (avgArray[rowIndex].length == 2) {
                        current.innerHTML = "F";
                        table.rows[rowIndex].cells[col-1].style.backgrounColor = "red";
                    } else if (parseInt(arrayVar.substring(0, 3)) < 60) {
                        current.innerHTML = "F";
                        table.rows[rowIndex].cells[col-1].style.backgrounColor = "red";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 62) {
                        current.innerHTML = "D-";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 66) {
                        current.innerHTML = "D";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 69) {
                        current.innerHTML = "D+";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 72) {
                        current.innerHTML = "C-";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 76) {
                        current.innerHTML = "C";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 79) {
                        current.innerHTML = "C+";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 82) {
                        current.innerHTML = "B-";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 86) {
                        current.innerHTML = "B";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 89) {
                        current.innerHTML = "B+";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 92) {
                        current.innerHTML = "A-";
                    } else if (parseInt(arrayVar.substring(0, 3)) <= 96) {
                        current.innerHTML = "A+";
                    } else if (arrayVar.length == 4) {
                        current.innerHTML = "A+";
                    } else {
                        current.innerHTML = "-";
                    }
                    grade1.push(current.innerHTML);
                }

            }
            if (colIndex == 2) {
                if (avgArray[rowIndex].length == 2) {
                    current.innerHTML = "0.0";
                    table.rows[rowIndex].cells[col-1].style.backgrounColor = "red";
                } else if (parseInt(arrayVar.substring(0, 3)) < 60) {
                    current.innerHTML = "0.0";
                    table.rows[rowIndex].cells[col-1].style.backgrounColor = "red";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 62) {
                    current.innerHTML = "0.7";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 66) {
                    current.innerHTML = "1.0";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 69) {
                    current.innerHTML = "1.3";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 72) {
                    current.innerHTML = "1.7";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 76) {
                    current.innerHTML = "2.0";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 79) {
                    current.innerHTML = "2.3";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 82) {
                    current.innerHTML = "2.7";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 86) {
                    current.innerHTML = "3.0";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 89) {
                    current.innerHTML = "3.3";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 92) {
                    current.innerHTML = "3.7";
                } else if (parseInt(arrayVar.substring(0, 3)) <= 96) {
                    current.innerHTML = "4.0";
                } else if (arrayVar.length == 4) {
                    current.innerHTML = "4.0";
                } else {
                    current.innerHTML = "-";
                }
                grade2.push(current.innerHTML);
            }
        }
    }
}
//function switches display of grading system in record table's right-most column based on user selection
function replace(input) {
    var table = document.getElementById("record");
    var gradeTable = document.getElementById("gradeConversion");
    var col = table.rows[0].cells.length;
    if (input == 1) {
        table.rows[0].cells[col - 1].innerHTML = "Letter Grade";
        for (var i = 1; i <= currentRow + 1; i++) {
            table.rows[i].cells[col - 1].innerHTML = gradeTable.rows[i].cells[1].innerHTML;
        }
        selectedGrade = 1;
    } else if (input == 2) {
        table.rows[0].cells[col - 1].innerHTML = "4.0 Scale";
        for (var i = 1; i <= currentRow + 1; i++) {
            table.rows[i].cells[col - 1].innerHTML = gradeTable.rows[i].cells[2].innerHTML;
        }
        selectedGrade = 2;
    } else {
        table.rows[0].cells[col - 1].innerHTML = "Average (%)";
        for (var i = 1; i <= currentRow + 1; i++) {
            table.rows[i].cells[col - 1].innerHTML = avgArray[i + 1];
        }
        selectedGrade = 0;
    }
}
//function changes grading system selection
function changeGrading(num) {
    selectedGrade = num;
    replace(selectedGrade);
}
//function saves tables state using cookie (not working)
function save() {
    table = document.getElementById("record");
    var cell;
    for (var p = 0; p < currentRow; p++) {
        for (var q = 0; q < table.rows[0].length; q++) {
            cell = table.rows[p].cells[q].innerHTML;
            savedTable.push(cell);
        }
    }
    //saving arrays as cookies - https://stackoverflow.com/questions/2980143/i-want-to-store-javascript-array-as-a-cookie
    var json_str = JSON.stringify(savedTable);
    setCookie('mycookie', json_str);
}
//function restores to table to saved state on button click (not working)
function restore() {
    var json_str = getCookie('mycookie');
    var arr = JSON.parse(json_str);
    table = document.getElementById("record");
    var x = 0;
    var rowDiff = Math.abs(currentRow - 10);
    if (currentRow > 10) {
        for (var k = 0; k < rowDiff; k++) {
            deleteRow();
        }
    } else if (currentRow < 10) {
        for (var l = 0; l < rowDiff; l++) {
            addRow();
        }
    } else {
        console.log("Equal Rows");
    }

    var colDiff = Math.abs(colNum - 8);
    if (colNum > 8) {
        for (var m = 0; m < colDiff; m++) {
            deleteColumn();
        }
    } else if (colNum < 8) {
        for (var n = 0; n < colDiff; n++) {
            addColumn();
        }
    } else {
        console.log("Equal Columns");
    }
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 7; j++) {
            table.rows[i].cells[j].innerHTML = savedTable[x];
            x++;
        }
    }
}
//functions setCookie and getCookie used to store array as a cookie
//https://stackoverflow.com/questions/4825683/how-do-i-create-and-read-a-value-from-cookie
const setCookie = (name, value, days = 7, path = '/') => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path
}
const getCookie = (name) => {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=')
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '')
}
