// TO-DO List:
// * Due Dates
// * Make Icons

// Check if there is already a value in local storage
if (!localStorage.getItem('store_tasks')) {

    // If not, set the value to [] in local storage
    localStorage.setItem('store_tasks', []);
}

// CSame as above
if (!localStorage.getItem('deleted_tasks')) {

    localStorage.setItem('deleted_tasks', []);
}

// This is for calculating the UTC - 7 current time
function getUTCMinusSeven(date) {
    if (date.getUTCHours() - 7 < 0) {
        return 24 + (date.getUTCHours() - 7);
    }
    else {
        return date.getUTCHours() - 7;
    }
}

// For the clock
function currentTime() {
  var date = new Date(); /* creating object of Date class */
  var year = date.getFullYear();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  year = updateTime(year);
  day = updateTime(day);
  month = updateTime(month);

  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  hour = updateTime(hour);
  min = updateTime(min);
  sec = updateTime(sec);
  // Optional Clock
  document.getElementById("clock").innerText = day + "/" + month + "/" + year + "\n" + 
    getUTCMinusSeven(date) + " : " + min + " : " + sec + "(UTC-7) \xa0\xa0\xa0\xa0\xa0" + hour + " : " + min + " : " + sec;
  /* adding time to the div */
  var t = setTimeout(function(){ currentTime() }, 1000); /* setting timer */
}

// If the time is less than 10, have a 0 in front
function updateTime(k) {
  if (k < 10) {
    return "0" + k;
  }
  else {
    return k;
  }
}

//Initialize the day downscroll bar
function makeDayList() {
    const dayslist = document.getElementById("day");
    for (let i = 1; i < 32; i++) {
        // One way to do it 
        //const para = document.createElement("option");
        //const node = document.createTextNode(1);
        //para.appendChild(node);
        //dayslist.appendChild(para);

        // Other easier way
        dayslist.innerHTML += "<option>" + i + "</option>"
        
        //console.log(para);
        //console.log(dayslist.innerHTML);

        //dayslist.innerHTML += "<option>2</option>"

        //console.log(dayslist.innerHTML);
        //para = document.createElement("option");
        //node = document.createTextNode(2);
        //para.appendChild(node);
        //dayslist.appendChild(para);
    }
    document.getElementById("month").disabled = true;
    dayslist.disabled = true;
}

//Initialize the year downscroll bar
function makeYearList() {
    var date = new Date(); /* creating object of Date class */
    var year = date.getFullYear();
    const yearslist = document.getElementById("year");
    for (let i = year; i < year + 100; i++) {
        yearslist.innerHTML += "<option>" + i + "</option>"
    }
    yearslist.disabled = true;
}

// Global Variables
// Current tasks in the webpage
var cur_tasks = [];
// In the recently deleted pile
var del_tasks = [];
// Pulls the tasks from the local storage and places then here
// 2-D array for which list, and what it says
var stored = [];
// Allows elements to have unique ids
var lastid = 0;

// A clear all function to remove everything
function clearList() {
    // Optional Use 
    /*
    document.querySelector('#highest').innerHTML = "Highest Priority";
    document.querySelector('#medium').innerHTML = "Medium Priority";
    document.querySelector('#lowest').innerHTML = "Lowest Priority";

    cur_tasks = [];
    del_tasks = [];
    stored = [];

    localStorage.setItem('deleted_tasks', []);
    localStorage.setItem('store_tasks', []);*/
}

// This is for tasks that are in the recently deleted pile
// Looks for it, and deletes it both from webpage and the array variable
// Then updates the local storage
function removeFromTrash(itemid) {
    var item = document.getElementById(itemid);

    item.parentNode.removeChild(item);
    
    for (i = 0; i < del_tasks.length; i++) {
        if (del_tasks[i] === item.firstChild.nodeValue) {
            del_tasks.splice(i, 1);
            break;
        }
    }

    localStorage.setItem('deleted_tasks', JSON.stringify(del_tasks));
}

// This is for tasks that are in one of the priority lists
// Looks for it, and deletes it both from webpage and the array variable
// Changes the button name, then updates the local storage
function removeFromLists(itemid) {
    var item = document.getElementById(itemid);

    item.parentNode.removeChild(item);
    
    for (i = 0; i < stored.length; i++) {
        if (stored[i][1] === item.firstChild.nodeValue) {
            del_tasks.push(item.firstChild.nodeValue);
            stored.splice(i, 1);
            break;
        }
    }

    // Changes what the button of list item does
    item.childNodes[1].innerHTML = "remove";
    item.childNodes[1].setAttribute('onClick', 'removeFromTrash("' + itemid + '")');

    // Changes what the first item in dropdown menu of about button does
    var dropmenu = item.childNodes[2].childNodes[1];
    dropmenu.childNodes[0].innerHTML = "Completely Remove";
    dropmenu.childNodes[0].setAttribute('onClick', 'removeFromTrash("' + itemid + '")');
    
    // Leaves only one option for now
    dropmenu.removeChild(dropmenu.childNodes[2]);
    dropmenu.removeChild(dropmenu.childNodes[1]);

    document.querySelector('#discarded').append(item);

    localStorage.setItem('deleted_tasks', JSON.stringify(del_tasks));
    localStorage.setItem('store_tasks', JSON.stringify(stored));
}

// For changing the visibility of the buttons to delete tasks
function makeVisible(itemid) {
    var item = document.getElementById(itemid);

    //item.childNodes[1].style.visibility = "visible";
    item.childNodes[2].childNodes[0].style.visibility = "visible";
}

function makeInvisible(itemid) {
    var item = document.getElementById(itemid);

    //item.childNodes[1].style.visibility = "hidden";
    item.childNodes[2].childNodes[0].style.visibility = "hidden";
}

// Fix name later
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function showDropdown(dropdownid) {
    document.getElementById("myDropdown" + dropdownid).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Functions for changing the text based off where the task has moved
function moveHigh(itemid, dropdownid) {
    var item = document.getElementById(itemid);

    item.parentNode.removeChild(item);    

    for (i = 0; i < stored.length; i++) {
        if (stored[i][1] === item.firstChild.nodeValue) {
            stored[i][0] = "highest";
            break;
        }
    }

    document.querySelector('#highest').append(item);

    localStorage.setItem('store_tasks', JSON.stringify(stored));

    var dropmenu = document.getElementById(dropdownid);
    dropmenu.childNodes[2].innerText = "Move To Medium Prioriy";
    dropmenu.childNodes[2].setAttribute('onClick', 'moveMid("' + itemid + '","' + dropdownid + '")');
    dropmenu.childNodes[3].innerText = "Move To Lowest Prioriy";
    dropmenu.childNodes[3].setAttribute('onClick', 'moveLow("' + itemid + '","' + dropdownid + '")');
}

function moveMid(itemid, dropdownid) {
    var item = document.getElementById(itemid);

    item.parentNode.removeChild(item);  

    for (i = 0; i < stored.length; i++) {
        if (stored[i][1] === item.firstChild.nodeValue) {
            stored[i][0] = "medium";
            break;
        }
    }  

    document.querySelector('#medium').append(item);

    localStorage.setItem('store_tasks', JSON.stringify(stored));

    var dropmenu = document.getElementById(dropdownid);
    dropmenu.childNodes[2].innerText = "Move To Highest Prioriy";
    dropmenu.childNodes[2].setAttribute('onClick', 'moveHigh("' + itemid + '","' + dropdownid + '")');
    dropmenu.childNodes[3].innerText = "Move To Lowest Prioriy";
    dropmenu.childNodes[3].setAttribute('onClick', 'moveLow("' + itemid + '","' + dropdownid + '")');
}

function moveLow(itemid, dropdownid) {
    var item = document.getElementById(itemid);

    item.parentNode.removeChild(item);    

    for (i = 0; i < stored.length; i++) {
        if (stored[i][1] === item.firstChild.nodeValue) {
            stored[i][0] = "lowest";
            break;
        }
    } 

    document.querySelector('#lowest').append(item);

    localStorage.setItem('store_tasks', JSON.stringify(stored));

    var dropmenu = document.getElementById(dropdownid);
    // Changing the second menu item
    dropmenu.childNodes[2].innerText = "Move To Highest Prioriy";
    dropmenu.childNodes[2].setAttribute('onClick', 'moveHigh("' + itemid + '","' + dropdownid + '")');
    // Changing the last menu item
    dropmenu.childNodes[3].innerText = "Move To Medium Prioriy";
    dropmenu.childNodes[3].setAttribute('onClick', 'moveMid("' + itemid + '","' + dropdownid + '")');
}

// Allows the user to edit what the tasks say
function editTask(itemid) {
    var item = document.getElementById(itemid);

    item.childNodes[0].nodeValue = "Testing value";
}

// For adding a list item to one of the lists (including recently deleted)
function addListItem(listItem, itemLoc, click_function) {
    var li = document.createElement('li');

    li.appendChild(document.createTextNode(listItem));
    li.setAttribute('id', 'item' + lastid);
    li.setAttribute('onMouseOver', 'makeVisible("' + 'item' + lastid + '")');
    li.setAttribute('onMouseOut', 'makeInvisible("' + 'item' + lastid + '")');

    
    var removeButton = document.createElement('button');
    if (click_function === 'removeFromLists') {
        removeButton.appendChild(document.createTextNode("move to trash"));
    }
    else {
        removeButton.appendChild(document.createTextNode("remove"));
    }
    
    removeButton.setAttribute('onClick', click_function + '("' + 'item' + lastid + '")');
    removeButton.style.visibility = "hidden";
    li.appendChild(removeButton); 


    // Creates a dropdown menu
    var div = document.createElement('div');
    div.setAttribute('class', 'dropdown');
    li.appendChild(div);


    var aboutButton = document.createElement('button');
    aboutButton.innerText = "...";
    aboutButton.setAttribute('onClick', 'showDropdown("' + lastid + '")');
    aboutButton.setAttribute('class', 'dropbtn');
    aboutButton.style.visibility = "hidden";
    div.appendChild(aboutButton);


    var innerdiv = document.createElement('div');
    innerdiv.setAttribute('id', 'myDropdown' + lastid);
    innerdiv.setAttribute('class', 'dropdown-content');
    div.appendChild(innerdiv);

    // This is the option for removing the task
    var remove_anchor = document.createElement('a');
    remove_anchor.setAttribute('id', 'remove');
    remove_anchor.setAttribute('onClick', click_function + '("' + 'item' + lastid + '")');
    if (click_function === 'removeFromLists') {
        remove_anchor.innerText = "Move To Trash";
    }
    else {
        remove_anchor.innerText = "Completely Remove";   
    }
    innerdiv.appendChild(remove_anchor);


    // This is the option for editing the task
    var edit_anchor = document.createElement('a');
    edit_anchor.setAttribute('id', 'edit');
    edit_anchor.setAttribute('onClick', 'editTask("' + 'item' + lastid + '")');
    edit_anchor.innerText = "Edit Task";
    innerdiv.appendChild(edit_anchor);

    if (click_function === 'removeFromLists') {
        // When having loops inside function called by a loop
        // Can't have same name for loop counter
        for (j = 0; j < 3; j++) {
            var anchor = document.createElement('a');
            if ((itemLoc === 'highest') && (j === 0)) {
                continue;
            }
            else if ((itemLoc === 'medium') && (j === 1)) {
                continue;
            }
            else if ((itemLoc === 'lowest') && (j === 2)) {
                continue;
            }
            else {
                console.log("not yet");
            }

            if (j === 0) {
                //anchor.setAttribute('id', 'movehighest' + lastid);
                anchor.setAttribute('onClick', 'moveHigh("' + 'item' + lastid + '","myDropdown' + lastid + '")');
                anchor.innerText = "Move To Highest Prioriy";    
            }
            else if (j === 1) {
                //anchor.setAttribute('id', 'movehighest' + lastid);
                anchor.setAttribute('onClick', 'moveMid("' + 'item' + lastid + '","myDropdown' + lastid + '")');
                anchor.innerText = "Move To Medium Prioriy";    
            }
            else if (j === 2) {
                //anchor.setAttribute('id', 'movehighest' + lastid);
                anchor.setAttribute('onClick', 'moveLow("' + 'item' + lastid + '","myDropdown' + lastid + '")');
                anchor.innerText = "Move To Lowest Prioriy";    
            }
            innerdiv.appendChild(anchor);
        }
    }


    lastid += 1;

    // Add new element to our unordered list:
    document.querySelector('#' + itemLoc).append(li);
}


// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    // For the clock to initialize
    currentTime();

    // Initialize the lists for the day and the year
    makeDayList();
    makeYearList();

    // Upon opening, put anything in the storage onto the list
    if (localStorage.getItem('store_tasks').length != 0) {
        stored = JSON.parse(localStorage.getItem('store_tasks'));
    
        // Upon opening, load the list up 
        for (i = 0; i < stored.length; i++) {
            addListItem(stored[i][1], stored[i][0], 'removeFromLists');
        }
    }
    else {
        stored = [];
    }

    // Also upon opening check if anything in the deleted pile
    if (localStorage.getItem('deleted_tasks').length != 0) {
        del_tasks = JSON.parse(localStorage.getItem('deleted_tasks'));
    
        // Upon opening, load the list up 
        for (i = 0; i < del_tasks.length; i++) {
            addListItem(del_tasks[i], 'discarded', 'removeFromTrash');
        }
    }
    else {
        del_tasks = [];
    }

    // Select the submit button and input to be used later
    const submit = document.querySelector('#submit');
    const newTask = document.querySelector('#task');

    const clear = document.querySelector('#clear');

    // Disable submit button by default:
    submit.disabled = true;

    // These must be placed inside the load function
    // Enables the date feature if the date button is checked
    document.getElementById("due_date_have").onclick = () => {
        document.getElementById("month").disabled = false;
        document.getElementById("day").disabled = false;
        document.getElementById("year").disabled = false;
    }
    // Disables the date feature if the date button is checked
    document.getElementById("due_date_not").onclick = () => {
        document.getElementById("month").disabled = true;
        document.getElementById("day").disabled = true;
        document.getElementById("year").disabled = true;
    }



    // Listen for input to be typed into the input field
    newTask.onkeyup = () => {
        if (newTask.value.length > 0) {
            submit.disabled = false;
        }
        else {
            submit.disabled = true;
        }
    }

    // Listen for submission of form
    document.querySelector('form').onsubmit = () => {
        // Check which radio button was selected
        var radio_val = document.querySelector('input[name="priority"]:checked').value;

        // Find the task the user just submitted
        const task = newTask.value;

        addListItem(task, radio_val, 'removeFromLists');

        // Clear out input field:
        newTask.value = '';

        // Disable the submit button again:
        submit.disabled = true;

        stored.push([radio_val, task])

        // Store tasks in local storage
        localStorage.setItem('store_tasks', JSON.stringify(stored));

        // Stop form from submitting
        return false;
    }

    // Listen for submission of form
    document.querySelector('#clear').onclick = clearList;
});