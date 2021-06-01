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
    currentHour = today.getHours();
     

}