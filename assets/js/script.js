var currentDate = ""; 
var currentDateString = ""; 
var currentHour = 9; 
var timeEntries = [];
// local storage and displays
const timeEntriesName = "workDaySchedulerList"; 
const firstEntry = 9; 
const lastEntry = 17; 
const hourMap = ["12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM","12PM",
                "1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM"]; 
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"];

setCurrentDateAndHour(); // Set currentDate, currentDateString, and currentHour, display date in header
buildTimeBlocks(); // Build rest of html for page
getTimeEntries(); // See if there are entries in localStorage and load them



// Done when page loads; sets date in header and determines current hour
function setCurrentDateAndHour() {
    var today = new Date(); // gets current date
    var day = today.getDate();
    var dayEnd = "th"; // 1st, 2nd, 3rd, 4th, etc.

    currentHour = today.getHours(); // current hour, in military format

    // pad with zero if day is less than 10 for sorting purposes
    if (day < 10) {
        currentDate = today.getFullYear() + months[today.getMonth()] + "0" + day; 
    }
    else {
        currentDate = today.getFullYear() + months[today.getMonth()] + day;
    }

    // Add correct ending to day; default to initialized value of "th"
    if ((day === 1) || (day === 21) || (day === 31)) {
        dayEnd = "st";
    }
    else if ((day === 2) || (day === 22)) {
        dayEnd = "nd";
    }
    else if ((day === 3) || (day === 23)) {
        dayEnd = "rd";
    }

    currentDateString = days[today.getDay()] + ", " + months[today.getMonth()] + " " + 
        day + dayEnd + ", " + today.getFullYear(); // date string to display in header
    $("#currentDay").text(currentDateString); // set header date
}

// Creates time blocks
function buildTimeBlocks() {
    var containerDiv = $(".container"); // get the container div to append new rows to

    // Loop through hourMap, from [firstEntry] of "9AM" to [lastEntry] of "5PM"
    for (let hourBlock=firstEntry; hourBlock <= lastEntry; hourBlock++) {
        // build the html for the row and the first column
        var newHtml = '<div class="row time-block"> ' +
            '<div class="col-1 hour">' + hourMap[hourBlock] + '</div> ';
        
        // conditionally set second column to current class: past, present or future
        if (hourBlock < currentHour) {
            newHtml = newHtml + '<textarea class="col-10 description past" id="text' + 
                hourMap[hourBlock] + '"></textarea> ';
        }
        else if (hourBlock === currentHour) {
            newHtml = newHtml + '<textarea class="col-10 description present" id="text' + 
                hourMap[hourBlock] + '"></textarea> ';
        }
        else {
            newHtml = newHtml + '<textarea class="col-10 description future" id="text' + 
                hourMap[hourBlock] + '"></textarea> ';
        };

        // add last column and close the row div
        newHtml = newHtml + '<button class="btn saveBtn col-1" value="' + hourMap[hourBlock] + '">' +
            '<i class="fas fa-save"></i></button> ' +
            '</div>';

        // add new elements to container
        containerDiv.append(newHtml);
    }
}
// save button event handler
$(".saveBtn").click(saveClick); 
// loads timeEntries array from localStorage
function getTimeEntries() {
    var teList = JSON.parse(localStorage.getItem(timeEntriesName));

    if (teList) {
        timeEntries = teList;
    }

    for (let i=0; i<timeEntries.length; i++) {
        // only load entries for today
        if (timeEntries[i].day == currentDate) {
            $("#text"+timeEntries[i].time).val(timeEntries[i].text); // update text in correct hour
        }
    }
}

// onClick event for all buttons
function saveClick() {
    var hourBlock = $(this).val(); // get which hour block we're in from button's value
    var entryFound = false;
    var newEntryIndex = timeEntries.length; // where in the timeEntries array the new object goes
    // create new timeEntries object
    var newEntry = {day: currentDate, time: hourBlock, text: $("#text"+hourBlock).val()}; 

    // do proper time comparison
    function timeGreater(time1,time2) {
        var num1 = parseInt(time1.substring(0, time1.length-2)); // numeric part of time1
        var num2 = parseInt(time2.substring(0, time2.length-2)); // numeric part of time2
        var per1 = time1.substr(-2,2); // AM/PM period for time1
        var per2 = time2.substr(-2,2); // AM/PM period for time2

        // Need to convert 12 noon to zero for comparison below to work
        if (num1 === 12) {
            num1 = 0;
        }

        if (num2 === 12) {
            num2 = 0;
        }

        // can compare time period first, if equal, then compare numeric part of time
        if (per1 < per2) {
            return false; // AM < PM
        }
        else if (per1 > per2) {
            return true; // PM > AM
        }
        else {
            return (num1 > num2);
        }
    }

    // check the timeEntries array to see if there is already an entry for this hour
    for (let i=0; i<timeEntries.length; i++) {
        if (timeEntries[i].day == currentDate) {
            if (timeEntries[i].time == hourBlock) {
                timeEntries[i].text = newEntry.text; // If entry already exists, just update text
                entryFound = true; // entry already exists
                break;
            }
            // entry does not exist - insert it when you reach the first hour that is greter
            else if (timeGreater(timeEntries[i].time, hourBlock)) {
                newEntryIndex = i;
                break;
            }
        }
        // no entries exist for current day - insert when you reach first day that is greater
        else if (timeEntries[i].day > currentDate) {
            newEntryIndex = i;
            break;
        }
    }

    // If the entry didn't already exist, add it to the array in the appropriate place
    if (!entryFound) {
        timeEntries.splice(newEntryIndex, 0, newEntry);
    }

    // store in local storage
    localStorage.setItem(timeEntriesName, JSON.stringify(timeEntries));
};
