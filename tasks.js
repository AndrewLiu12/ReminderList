// TO-DO List:
// * Recently discarded
// * Due Dates

// Check if there is already a value in local storage
if (!localStorage.getItem('store_tasks')) {

    // If not, set the value to [] in local storage
    localStorage.setItem('store_tasks', []);
}

// Check if there is already a value in local storage
if (!localStorage.getItem('deleted_tasks')) {

    // If not, set the value to [] in local storage
    localStorage.setItem('deleted_tasks', []);
}

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
  // Personal Use
  document.getElementById("clock").innerText = year + "/" + month + "/" + day + "\n" + 
    getUTCMinusSeven(date) + " : " + min + " : " + sec + "(UTC-7) \xa0\xa0\xa0\xa0\xa0" + hour + " : " + min + " : " + sec;
  // Public Use
  //document.getElementById("clock").innerText = hour + " : " + min + " : " + sec;
  /* adding time to the div */
  var t = setTimeout(function(){ currentTime() }, 1000); /* setting timer */
}

function updateTime(k) {
  if (k < 10) {
    return "0" + k;
  }
  else {
    return k;
  }
}



// Global Variables
var cur_tasks = [];
var del_tasks = [];
var stored = [];
var lastid = 0;

function clearList() {
    document.querySelector('#highest').innerHTML = "Highest Priority";
    document.querySelector('#medium').innerHTML = "Medium Priority";
    document.querySelector('#lowest').innerHTML = "Lowest Priority";

    cur_tasks = [];
    del_tasks = [];
    stored = [];

    localStorage.setItem('deleted_tasks', []);
    localStorage.setItem('store_tasks', []);
}

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

    // Add new element to our unordered list:
    item.childNodes[1].innerHTML = "remove";
    item.childNodes[1].setAttribute('onClick', 'removeFromTrash("' + itemid + '")');
    document.querySelector('#discarded').append(item);

    localStorage.setItem('deleted_tasks', JSON.stringify(del_tasks));
    localStorage.setItem('store_tasks', JSON.stringify(stored));
}

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    // For the clock to initialize
    currentTime();

    // Upon opening, put anything in the storage onto the list
    if (localStorage.getItem('store_tasks').length != 0) {
        stored = JSON.parse(localStorage.getItem('store_tasks'));
    
        // Upon opening, load the list up 
        for (i = 0; i < stored.length; i++) {
            const li = document.createElement('li');
            //li.innerHTML = stored[i];
            li.appendChild(document.createTextNode(stored[i][1]));
            li.setAttribute('id', 'item' + lastid);
            var removeButton = document.createElement('button');
            removeButton.appendChild(document.createTextNode("move to trash"));
            removeButton.setAttribute('onClick', 'removeFromLists("' + 'item' + lastid + '")');
            li.appendChild(removeButton);

            lastid += 1;

            // Add new element to our unordered list:
            document.querySelector('#' + stored[i][0]).append(li);
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
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(del_tasks[i]));
            li.setAttribute('id', 'item' + lastid);
            var removeButton = document.createElement('button');
            removeButton.appendChild(document.createTextNode("remove"));
            removeButton.setAttribute('onClick', 'removeFromTrash("' + 'item' + lastid + '")');
            li.appendChild(removeButton);

            lastid += 1;

            // Add new element to our unordered list:
            //document.querySelector('#highest').append(li);
            document.querySelector('#discarded').append(li);
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
        //console.log(document.querySelector('input[name="priority"]:checked').value);
        var radio_val = document.querySelector('input[name="priority"]:checked').value;

        // Find the task the user just submitted
        const task = newTask.value;

        // Create a list item for the new task and add the task to it
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(task));
        li.setAttribute('id', 'item' + lastid);
        var removeButton = document.createElement('button');
        removeButton.appendChild(document.createTextNode("move to trash"));
        removeButton.setAttribute('onClick', 'removeFromLists("' + 'item' + lastid + '")');
        li.appendChild(removeButton);

        lastid += 1;

        // Add new element to our unordered list:
        document.querySelector('#' + radio_val).append(li);

        // Add the new_task to the list
        //cur_tasks.push([radio_val, task]);

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