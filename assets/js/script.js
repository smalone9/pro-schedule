// set variables
var setDate = "";
var dateToday = "";
var hour = 9;
var time = [];

// localStorage name
const timeName = "workDayScheduler";
// set parameters between 9 am and 5 pm
const entryOne = 9;
const entryFinal = 17;
const hourMap = ["12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM","12PM",
"1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", 
"July", "August", "September", "October", "November", "December"];

// set and display date
setDateHour();
timeBlocks();
timeCheck();

// save buttons
$(".saveBtn").click(saveClick);

// header date and time
function setDateHour() {
    var today = new Date();
    var day = today.getDate();
    var dayFinal = "th";
    hour = today.getHours();
    // easily sort days < 10
    if (day < 10) {
        dateToday = today.getFullYear() + months[today.getMonth()] + "0" + day;
        }
    else {
        dateToday = today.getFullYear() + months[today.getMonth()] + day;
    }
    // date ending
    if ((day === 21) || (day === 21) || (day === 31)) {
        dayEnd = "st";
    }
    else if ((day === 2) || (day === 22)) {
        dayEnd = "nd";
    }
    else if ((day === 3) || (day === 23)) {
        dayEnd = "rd";
    }
    // display date in header
    dateToday = days[today.getToday()] + ", " + months[today.getMonth()] + " " + day + dayFinal + " ," + today.getFullYear();
    $("#currentDay").text(dateToday);
}

// time blocks
function TimeBlocks() {
    var containerDiv = $(".container"); 
    //hourMap loop
    for (let hourBlock=firstEntry; hourBlock <= lastEntry; hourBlock++) {
        var newRow = '<div class="row time-block"> ' + '<div class="col-md-1 hour"> ' + hourMap[hourBlock] + '</div>';
    }
}