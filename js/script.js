const taskTitle = document.getElementById('task');
const taskNotes = document.getElementById('notes');
const addBtn = document.getElementById('addBtn');
const taskListSection = document.getElementById('taskList');

const init = (function () {
	return {
		createTask: function () {
			// Creation phase of all HTML elements and buttons for the tasks
			if (document.getElementsByTagName('ol').length === 0) {
				taskListSection.appendChild(document.createElement('ol'));
			}
			let olElement = document.getElementsByTagName('ol')[0];
			if (document.getElementsByTagName('h2').length === 0) {
				taskListSection.insertBefore(document.createElement('h2'), olElement).appendChild(document.createTextNode('Текущи задачи'));
			}

			let createLI = olElement.appendChild(document.createElement('li'));
			let createNav = createLI.appendChild(document.createElement('nav'));

			createLI.appendChild(document.createTextNode(taskTitle.value));
			createLI.appendChild(document.createElement('br'));
			if (taskNotes.value.length > 0) {
				createLI.appendChild(document.createElement('blockquote')).appendChild(document.createElement('p')).appendChild(document.createTextNode(taskNotes.value));
				var blockQuote = document.getElementsByTagName('blockquote');
				for (each of blockQuote) {
					each.classList.add('blockQuote');
				}
			}
			createNav.appendChild(document.createElement('button')).appendChild(document.createTextNode('приключи'));
			createNav.appendChild(document.createElement('button')).appendChild(document.createElement('span')).appendChild(document.createTextNode('редактирай'));
			createNav.appendChild(document.createElement('button')).appendChild(document.createTextNode('изтрий'));

			// Clear input fields
			taskTitle.value = '';
			taskNotes.value = '';

			// Adding styling to the created buttons
			let doneBtn = document.querySelectorAll('nav button:first-child');
			for (let elmnt of doneBtn) {
				elmnt.classList.add('doneBtn');
			}
			let editBtn = document.querySelectorAll('nav button:nth-child(2)');
			for (let elmnt of editBtn) {
				elmnt.classList.add('editBtn');
			}
			let delBtn = document.querySelectorAll('nav button:nth-child(3)');
			for (let elmnt of delBtn) {
				elmnt.classList.add('delBtn');
			}

			// Send the created buttons to the event listeners
			taskButtonsEvents(
				{
					doneBtn,
					editBtn,
					delBtn,
					blockQuote,
					olElement
				}
			);
		}
	}
})();

// Function to remove error messages and classes
function clearErrors() {
	if (document.getElementsByClassName('error')[0]) {
		taskTitle.classList.remove('error');
		document.getElementsByClassName('error')[0].remove();
	}
}

function initialChecks() {
	// Proceed with the app initialisation if the title field is not empty
	if (taskTitle.value.length > 0 && taskTitle.value !== ' ') {
		// Clear if there were any error messages
		clearErrors();
		// Task creation
		init.createTask();
	}

	// Actions to perform if the mandatory 'Title' field is empty
	else {
		clearErrors();
		let createSpan = document.createElement('span');
		let taskCreationLI = document.getElementsByTagName('li')[0];

		createSpan.appendChild(document.createTextNode('*Въведи заглавие на задачата'));
		createSpan.classList.add('error');
		taskTitle.classList.add('error');
		taskCreationLI.insertBefore(createSpan, document.getElementsByTagName('label')[0]);
	}
}


// -------------------------------------------------
// 					EVENT LISTENERS
// -------------------------------------------------

// Trigger for 'ADD task' button functionality
addBtn.addEventListener('click', initialChecks);

taskTitle.addEventListener('keypress', function(event) {
	// TAB key focus functionality
	if (event.keyCode === 9 || event.which === 9) {
		taskNotes.focus();
		event.preventDefault();
	}
	// ENTER key 'add task' functionality
	if (this.value.length > 0 && (event.keyCode === 13 || event.which === 13)) {
		init.createTask();
	}
});

taskNotes.addEventListener('keydown', function(event){
	// TAB key focus functionality
	if (event.keyCode === 9 || event.which === 9) {
		taskTitle.focus();
		event.preventDefault();
	}
	// SHIFT+ENTER key combination 'add task' functionality within the Notes field
	if (this.value.length > 0 && taskTitle.value.length > 0 && ((event.shiftKey && event.keyCode === 13) || (event.shiftKey && event.which === 13))) {
		init.createTask();
		event.preventDefault();
	}
});


// Event listeners for task-related buttons (done, edit and delete)
function taskButtonsEvents(btns) {
	// DONE button functionality
	for (let item of btns.doneBtn) {
		item.addEventListener('click', function(event) {
			event.target.parentElement.parentElement.classList.toggle('done');
			if (btns.blockQuote) {
				event.target.parentElement.parentElement.getElementsByTagName('blockquote')[0].classList.toggle('done');
			}
			event.stopImmediatePropagation();
		});
	}

	// EDIT button functionality
	for (let item of btns.editBtn) {
		item.addEventListener('click', function(event) {
			let taskContainer = event.target.parentElement.parentElement;
			taskContainer.after(document.createElement('textarea'));
			taskContainer.classList.add('none');
			let titleField = document.getElementsByTagName('textarea')[1];
			titleField.value = taskContainer.childNodes[1].nodeValue;
			// console.log('Edit buttons functionality is yet to be implemented!');
		});
	}

	// DELETE button functionality
	for (let item of btns.delBtn) {
		item.addEventListener('click', function(event) {
			event.target.parentElement.parentElement.remove();

			//Check if there are other tasks if blank - remove h2
			if (document.getElementsByTagName('ol')[0].children.length === 0 && document.getElementsByTagName('h2')[0]) {
				document.getElementsByTagName('h2')[0].remove();
			}
		});
	}
}
