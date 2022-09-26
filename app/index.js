import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
//for steps
import { me as appbit } from "appbit";
import { today } from "user-activity";
//battery
import { battery } from "power";

import { me as device } from "device"; //console

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myTime = document.getElementById("myTime");
const myDate = document.getElementById("myDate");
const mySteps = document.getElementById("mySteps");
const myDebug = document.getElementById("myDebug");
const myWeekNum = document.getElementById("myWeekNum");
const myMMDD = document.getElementById("myMMDD");

//function to generate week num
function current_week_num() {
  // from https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
  var v_date = new Date();
  // ISO week date weeks start on Monday, so correct the day number
  var nDay = (v_date.getDay() + 6) % 7;

  // ISO 8601 states that week 1 is the week with the first Thursday of that year
  // Set the target date to the Thursday in the target week
  v_date.setDate(v_date.getDate() - nDay + 3);

  // Store the millisecond value of the target date
  var n1stThursday = v_date.valueOf();

  // Set the target to the first Thursday of the year
  // First, set the target to January 1st
  v_date.setMonth(0, 1);

  // Not a Thursday? Correct the date to the next Thursday
  if (v_date.getDay() !== 4) {
    v_date.setMonth(0, 1 + ((4 - v_date.getDay()) + 7) % 7);
  }

  // The week number is the number of weeks between the first Thursday of the year
  // and the Thursday in the target week (604800000 = 7 * 24 * 3600 * 1000)
  //var week_num = new int;
  return util.zeroPad(1 + Math.ceil((n1stThursday - v_date) / 604800000));
  }
//set current week num on buildtime (so we don't have to wait until night)
let buildtime_weeknum = current_week_num();
let test_date = new Date();
const weeknumArr = [
  [0,0,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,5],
  [5,5,5,5,5,5,6,6,6,6,6,6,6,7,7,7,7,7,7,7,8,8,8,8,8,8,8,9,52,52,52],
  [9,9,9,9,9,9,10,10,10,10,10,10,10,11,11,11,11,11,11,11,12,12,12,12,12,12,12,13,13,13,13],
  [13,13,13,14,14,14,14,14,14,14,15,15,15,15,15,15,15,16,16,16,16,16,16,16,17,17,17,17,17,17,52],
  [17,18,18,18,18,18,18,18,19,19,19,19,19,19,19,20,20,20,20,20,20,20,21,21,21,21,21,21,21,22,22],
  [22,22,22,22,22,23,23,23,23,23,23,23,24,24,24,24,24,24,24,25,25,25,25,25,25,25,26,26,26,26,52],
  [26,26,26,27,27,27,27,27,27,27,28,28,28,28,28,28,28,29,29,29,29,29,29,29,30,30,30,30,30,30,30],
  [31,31,31,31,31,31,31,32,32,32,32,32,32,32,33,33,33,33,33,33,33,34,34,34,34,34,34,34,35,35,35],
  [35,35,35,35,36,36,36,36,36,36,36,37,37,37,37,37,37,37,38,38,38,38,38,38,38,39,39,39,39,39,52],
  [39,39,40,40,40,40,40,40,40,41,41,41,41,41,41,41,42,42,42,42,42,42,42,43,43,43,43,43,43,43,44],
  [44,44,44,44,44,44,45,45,45,45,45,45,45,46,46,46,46,46,46,46,47,47,47,47,47,47,47,48,48,48,52],
  [48,48,48,48,49,49,49,49,49,49,49,50,50,50,50,50,50,50,51,51,51,51,51,51,51,52,52,52,52,52,52]
  ];
console.log("month="+test_date.getMonth()+
            "day="+(test_date.getDate()-1)+ 
            "weeknum="+weeknumArr[test_date.getMonth()][test_date.getDate()-1]
           );
let buildtime_weeknum_alt = weeknumArr[test_date.getMonth()][test_date.getDate()-1];

/* removed as of w38-7
function updateSteps() {
  mySteps.text = today.adjusted.steps;
}
*/ 

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  
  
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  //myTime.text = `${hours}:${mins}`;
  
  //update week num on mondays 0100, where getday returns 0=sun through 6=sat
  //if ((today.getDay() === 1) && (today.getHours() === 0)) {
  if ((today.getDay() === 1) && (today.getHours() < 3) && (today.getMinutes()===1)) { //update this three times (because we saw bugs in when this is run)
    let buildtime_weeknum = current_week_num();
    buildtime_weeknum_alt = weeknumArr[today.getMonth()][today.getDate()-1];
  }
  myTime.text = `${hours}:${mins}`;
  myMMDD.text = "mm"+util.zeroPad(today.getMonth()+1)+"dd"+util.zeroPad(today.getDate());
  myDate.text = "W"+buildtime_weeknum+" old";
  myWeekNum.text = "2022-W"+util.zeroPad(buildtime_weeknum_alt)+"-"+today.getDay(); //this is new w38-7
  myDebug.text = battery.chargeLevel + "%";
  //myDebug.text = "hello"
  //updateSteps(); // removed as of w38-7
}
