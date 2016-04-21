const MAX_HOURS = 48.0;
const MAX_MINUTES = 59.0;

var timerStarted = false;
var timeDone;

setInterval(update, 1);

// Updates the text
function update() {
	if (timerStarted) {
		var remaining = getRemaining();
		$("#hour").text(format(remaining["hours"], 2));
		$("#min").text(format(remaining["minutes"], 2));
		$("#sec").text(format(remaining["seconds"], 2));
		$("#milli").text(format(remaining["milli"], 3));
	}
}

// Formats the numbers to include leading 0s
function format(value, len) {
	value = value.toString();
	while (value.length < len) {
		value = "0" + value;
	}

	return value;
}

// Gets how much time is left until the time is done
function getRemaining() {
	var millLeft = timeDone - (new Date).getTime();

	if (millLeft < 0) {
		millLeft = 0;
	}

	return {
		"hours": Math.floor(millLeft / 1000.0 / 60 / 60),
		"minutes": Math.floor(millLeft / 1000.0 / 60 % 60),
		"seconds": Math.floor(millLeft / 1000.0 % 60),
		"milli": Math.floor(millLeft % 1000.0)
	};
}

// Gets the time based on the current mouse pointer
function getMouseTime(event) {
	var mouseX = event.pageX;
	var mouseY = event.pageY;
	var screenWidth = $(window).width();
	var screenHeight = $(window).height();
	var screenWidthBorder = screenWidth * .1;
	var screenHeightBorder = screenHeight * .1;

	// All this is to create a border around the center of the screen which doesn't change the values of the time
	mouseX = Math.max(screenWidthBorder, Math.min(screenWidth - screenWidthBorder, mouseX)) - screenWidthBorder;
	mouseY = Math.max(screenHeightBorder, Math.min(screenHeight - screenHeightBorder, mouseY)) - screenHeightBorder;

	screenWidth *= .8;
	screenHeight *= .8;

	mouseY = screenHeight - mouseY;

	// Returns the ratio of the mouseX to the width of the screen
	return {
		"hours": Math.round((mouseX/screenWidth) * MAX_HOURS), 
		"minutes": Math.round((mouseY/screenHeight) * MAX_MINUTES)
	};
}

// When the mouse moves, we want the time to update before the timer has started
$( document ).on("mousemove", function(event) {
	if (! timerStarted) {
		var mouseTime = getMouseTime(event);
		$("#hour").text(format(mouseTime["hours"], 2));
		$("#min").text(format(mouseTime["minutes"], 2));
	}
});

// When the mouse clicks, set that as the time
$( document ).click(function(event) { 
    // Check for left button
    if (!timerStarted && event.button == 0) {
    	// Calculate how many milliseconds from the current time the timer stops
    	timeDone = (new Date).getTime() + ($("#hour").text() * 60 * 60 * 1000) + ($("#min").text() * 60 * 1000);
        timerStarted = true;
    }
});