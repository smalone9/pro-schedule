var dateToday = ""; 
var dateTodayString = ""; 
var hourNow = 9; 
var enterTime = [];
// local storage and displays
const enterTimeName = "workDaySchedulerList"; 
const firstEntry = 9; 
const lastEntry = 17; 
const hourMap = ["12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM","12PM",
                "1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM"]; 
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"];
// header, html, and load localStorage
setdateTodayAndHour(); 
buildTimeBlocks(); 
getenterTime(); 
// Sets date
function setdateTodayAndHour() {
    var today = new Date(); 
    var day = today.getDate();
    var dayEnd = "th"; 
    hourNow = today.getHours(); 
   
    if (day < 10) {
        dateToday = today.getFullYear() + months[today.getMonth()] + "0" + day; 
    }
    else {
        dateToday = today.getFullYear() + months[today.getMonth()] + day;
    }

    // Date endings
    if ((day === 1) || (day === 21) || (day === 31)) {
        dayEnd = "st";
    }
    else if ((day === 2) || (day === 22)) {
        dayEnd = "nd";
    }
    else if ((day === 3) || (day === 23)) {
        dayEnd = "rd";
    }

    dateTodayString = days[today.getDay()] + ", " + months[today.getMonth()] + " " + 
        day + dayEnd + ", " + today.getFullYear(); 
    // set date in header
    $("#currentDay").text(dateTodayString); 
};

// Time blocks for HTML file
function buildTimeBlocks() {
    var containerDiv = $(".container"); 

    // hourMap loop
    for (let hourBlock=firstEntry; hourBlock <= lastEntry; hourBlock++) {
        var newHtml = '<div class="row time-block"> ' +
            '<div class="col-1 hour">' + hourMap[hourBlock] + '</div> ';
        
        if (hourBlock < hourNow) {
            newHtml = newHtml + '<textarea class="col-10 description past" id="text' + 
                hourMap[hourBlock] + '"></textarea> ';
        }
        else if (hourBlock === hourNow) {
            newHtml = newHtml + '<textarea class="col-10 description present" id="text' + 
                hourMap[hourBlock] + '"></textarea> ';
        }
        else {
            newHtml = newHtml + '<textarea class="col-10 description future" id="text' + 
                hourMap[hourBlock] + '"></textarea> ';
        };

        newHtml = newHtml + '<button class="btn saveBtn col-1" value="' + hourMap[hourBlock] + '">' +
            '<i class="fas fa-save"></i></button> ' +
            '</div>';

        // new container elements
        containerDiv.append(newHtml);
    };
};
// save button event handler
$(".saveBtn").click(saveClick); 
// loads enterTime array 
function getenterTime() {
    var teList = JSON.parse(localStorage.getItem(enterTimeName));

    if (teList) {
        enterTime = teList;
    }

    for (let i=0; i<enterTime.length; i++) {
        if (enterTime[i].day == dateToday) {
            $("#text"+enterTime[i].time).val(enterTime[i].text); 
        };
    };
};

// click event
function saveClick() {
    var hourBlock = $(this).val(); 
    var entryFound = false;
    var newEntryIndex = enterTime.length; 
    // new object
    var newEntry = {day: dateToday, time: hourBlock, text: $("#text"+hourBlock).val()}; 

    // time comparison
    function timeGreater(time1,time2) {
        var num1 = parseInt(time1.substring(0, time1.length-2)); 
        var num2 = parseInt(time2.substring(0, time2.length-2)); 
        var per1 = time1.substr(-2,2);
        var per2 = time2.substr(-2,2); 

        // convert noon to zero
        if (num1 === 12) {
            num1 = 0;
        }
        if (num2 === 12) {
            num2 = 0;
        }
        if (per1 < per2) {
            return false; 
        }
        else if (per1 > per2) {
            return true; 
        }
        else {
            return (num1 > num2);
        };
    };
    // check the enterTime array 
    for (let i=0; i<enterTime.length; i++) {
        if (enterTime[i].day == dateToday) {
            if (enterTime[i].time == hourBlock) {
                enterTime[i].text = newEntry.text; 
                entryFound = true; 
                break;
            }
           else if (timeGreater(enterTime[i].time, hourBlock)) {
                newEntryIndex = i;
                break;
            }
        }
        else if (enterTime[i].day > dateToday) {
            newEntryIndex = i;
            break;
        };
    };

    // Add entry to array
    if (!entryFound) {
        enterTime.splice(newEntryIndex, 0, newEntry);
    };

    // store in local storage
    localStorage.setItem(enterTimeName, JSON.stringify(enterTime));
};
