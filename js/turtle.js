var speedTurtle;
var svansDown;
$(document).ready(function() {
    	eval($.turtle());
    	speedTurtle = 25;
    	pd();
    	svansDown=true;
    	goHome();
    });

goHome = function(){
	cg();
	home();
	speed(Infinity);
	pu();
    moveto(-280,-20	);
    if (svansDown) {
    	pd();
    	pen('red');
    }
   	speed(speedTurtle);
}

changeSpeed = function(newSpeed){
	speedTurtle = newSpeed/10;
	speed(speedTurtle);
	result = document.getElementById("currentspeed");
	result.value = newSpeed;
}

var commands,numberCommands;
var commandArray = [];
var isPause = false, isRunning = false;
var currentItteration = 0;
var currentCommand = currentItteration;
var ans;

runProgramm = function(){
	if (isRunning) return;
	isRunning = true;
	if (isPause && commandArray.length>0){
		unpause();
	} else{
		var programm = document.getElementById("programm");
		commands = programm.childNodes;
		numberCommands = commands.length;
		createCommandArray(0,1);
		currentCommand = currentItteration = 0;
		if (commandArray.length>0){
			doProgram();
		}
		isRunning = false;
	}	
}

doStop = function(){
	currentItteration = 0;
	currentCommand = 0;
	commandArray = [];
	isPause = false;
	isRunning = false;
	goHome();
}

doPause = function(){
	isPause = true;
	isRunning = false;
}

unpause = function(){
	isPause = false;
	isRunning = true;
	currentCommand = currentItteration;
	doProgram();
}

doProgram = function(){
	setTimeout(function() {
		doCommand(commandArray[currentCommand]);
		currentCommand++;
		if(isPause){
			currentItteration = currentCommand;
		}
		if(currentCommand >= commandArray.length) { 
			currentItteration = 0;
			commandArray = [];
			isRunning = false;
		}
		if(currentCommand < commandArray.length && !isPause) 
			doProgram();
	}, 1000/speedTurtle); 
}

createCommandArray = function(start,n){
	var i=0;
	var ans;
	while (i<n){
		var j = start;
		ans = 0;
		while (true){
			if (j>=numberCommands) {
				ans = j;
				break;
			}
			var commandType = commands[j].getAttribute('data-type-command');
			console.log(commandType,' ',j);
			if (commandType=="repeat-command"){
				j=createCommandArray(j+1,getValue(commands[j]));
			} else if (commandType=="end-circle-command"){
				ans = j;
			} else{
				commandArray.push(commands[j]);
			}
			if (ans!=0) break;
			j++;
		}
		i++;
	}
	if (ans==null) ans=start;
	return ans;
}

doCommand = function(commanda){
	var commandType = commanda.getAttribute('data-type-command');
	switch(commandType){
		case "fd-command":
			fd(getValue(commanda));
			break;
		case "rt-command":
			rt(getValue(commanda));
			break;
		case "lt-command":
			lt(getValue(commanda));
			break;
		case "pu-command":
			pu();
			break;
		case "pd-command":
			pd();
			break;
		default:
			break;
	}
}

getValue = function(element){
	var elements = element.getElementsByTagName('input');
	return parseInt(elements[0].value,10);
}