// Check if there is already a value in local storage
if (!localStorage.getItem('store_tasks')) {

    // If not, set the value to [] in local storage
    localStorage.setItem('store_tasks', []);
}

var cur_tasks = [];
var stored = [];
var lastid = 0;

function clearList() {
    document.querySelector('#tasks').innerHTML = "";

    cur_tasks = [];
    stored = [];

    localStorage.setItem('store_tasks', []);
}

/*function removeName(itemid){
    var item = document.getElementById(itemid);

    document.querySelector('#tasks').removeChild(item);

    for (i = 0; i < stored.length; i++) {
        if (stored[i] == item)

    }

    localStorage.setItem('store_tasks', JSON.stringify(stored.concat(cur_tasks)));
}*/

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    // Upon opening, put anything in the storage onto the list
    if (localStorage.getItem('store_tasks').length != 0) {
        stored = JSON.parse(localStorage.getItem('store_tasks'));
    
        // Upon opening, load the list up 
        for (i = 0; i < stored.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = stored[i];

            // Add new element to our unordered list:
            document.querySelector('#tasks').append(li);
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

        // Add new element to our unordered list:
        document.querySelector('#tasks').append(li);

        // Add the new_task to the list
        cur_tasks.push(task);

        // Clear out input field:
        newTask.value = '';

        // Disable the submit button again:
        submit.disabled = true;

        // Store tasks in local storage
        localStorage.setItem('store_tasks', JSON.stringify(stored.concat(cur_tasks)));

        // Stop form from submitting
        return false;
    }

    // Listen for submission of form
    document.querySelector('#clear').onclick = clearList;
});