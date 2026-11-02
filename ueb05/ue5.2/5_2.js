// Constructor for task objects.
// Receives a label and a reference to a dom element for the event log.
function task(taskLabel,evlog) {
	this.label = taskLabel;
	this.evlog = evlog;
	this.startButton = document.getElementById('start'+taskLabel);
	this.cancelButton = document.getElementById('cancel'+taskLabel);
	this.endButton = document.getElementById('end'+taskLabel);
	this.counter = 0;
	
	// Explain the code below
	this.startButton.addEventListener('click',
		()=> { runTaskPromise(this).then(
				() => {endTask(this)}
			).catch( 
				() => {cancelTask(this)}
			)
		}); 
		
	this.endButton.disabled = true;
	this.cancelButton.disabled = true;
}

function runTaskPromise(task) {
	task.evlog.innerHTML += '<pre>'+task.label+' started\t'+new Date() +'\n</pre>';
	task.startButton.disabled = true;
	task.endButton.disabled = false;
	task.cancelButton.disabled = false;
	
	// A fresh promise and fresh handlers belong to this start/end/cancel cycle.
	return new Promise((resolve, reject) => {
		function cleanup() {
			task.endButton.removeEventListener('click', onEnd);
			task.cancelButton.removeEventListener('click', onCancel);
		}
		function onEnd() {
			cleanup();
			resolve();
		}
		function onCancel() {
			cleanup();
			reject();
		}
		task.endButton.addEventListener('click', onEnd);
		task.cancelButton.addEventListener('click', onCancel);
	});
}



function endTask(task) {
	task.endButton.disabled = true;
	task.cancelButton.disabled = true;
	task.startButton.disabled = false;
	task.evlog.innerHTML += '<pre>'+task.label+' ended\t\t'+new Date() +'\n</pre>';
}

function cancelTask(task) {
	task.endButton.disabled = true;
	task.cancelButton.disabled = true;
	task.startButton.disabled = false;
	task.evlog.innerHTML += '<pre>'+task.label+' cancelled\t'+new Date() +'\n</pre>';
}


var evlog = document.getElementById('eventLog');
var taskA = new task('A',evlog);
var taskB = new task('B',evlog);