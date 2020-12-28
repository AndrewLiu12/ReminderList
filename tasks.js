// TO-DO List:
// * Priority list
// * Recently discarded
// * Clocks
// * Due Dates

// Check if there is already a value in local storage
if (!localStorage.getItem('store_tasks')) {

    // If not, set the value to [] in local storage
    localStorage.setItem('store_tasks', []);
}

// Global Variables
var cur_tasks = [];
var stored = [];
var lastid = 0;

function clearList() {
    document.querySelector('#highest').innerHTML = "Highest Priority";
    document.querySelector('#medium').innerHTML = "Medium Priority";
    document.querySelector('#lowest').innerHTML = "Lowest Priority";

    cur_tasks = [];
    stored = [];

    localStorage.setItem('store_tasks', []);
}

function removeName(itemid){
    var item = document.getElementById(itemid);

    item.parentNode.removeChild(item);

    //document.querySelector('#highest').removeChild(item);
    
    for (i = 0; i < stored.length; i++) {
        if (stored[i][1] === item.firstChild.nodeValue) {
            stored.splice(i, 1);
            break;
        }
    }
    /*for (i = 0; i < cur_tasks.length; i++) {
        if (cur_tasks[i][1] === item.firstChild.nodeValue) {
            cur_tasks.splice(i, 1);
            break;
        }
    }

    for (x in cur_tasks) {
        stored.push(x);
    }*/

    localStorage.setItem('store_tasks', JSON.stringify(stored));
}

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    // Upon opening, put anything in the storage onto the list
    if (localStorage.getItem('store_tasks').length != 0) {
        stored = JSON.parse(localStorage.getItem('store_tasks'));
    
        // Upon opening, load the list up 
        for (i = 0; i < stored.length; i++) {
            const li = document.createElement('li');
            //li.innerHTML = stored[i];
            li.appendChild(document.createTextNode(stored[i][1]));
            li.setAttribute('id', 'item'+lastid);
            var removeButton = document.createElement('button');
            removeButton.appendChild(document.createTextNode("remove"));
            removeButton.setAttribute('onClick', 'removeName("'+'item'+lastid+'")');
            li.appendChild(removeButton);

            lastid += 1;

            // Add new element to our unordered list:
            //document.querySelector('#highest').append(li);
            document.querySelector('#'+stored[i][0]).append(li);
        }
    }
    else {
        stored = [];
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
        li.setAttribute('id', 'item'+lastid);
        var removeButton = document.createElement('button');
        removeButton.appendChild(document.createTextNode("remove"));
        removeButton.setAttribute('onClick', 'removeName("'+'item'+lastid+'")');
        li.appendChild(removeButton);

        lastid += 1;

        // Add new element to our unordered list:
        document.querySelector('#'+radio_val).append(li);

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