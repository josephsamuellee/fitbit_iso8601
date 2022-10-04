  import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
//for steps
import { me as appbit } from "appbit"; //so that we can get user sleep information
if (!appbit.permissions.granted("access_sleep")) {
   console.log("We're not allowed to read a users' sleep!");
}
import sleep from "sleep";
if (sleep) {
    sleep.addEventListener("change", () => {
       console.log(`User sleep state is: ${sleep.state}`);
     });
  } else {
     console.warn("Sleep API not supported on this device, or no permission")
  }

import { today } from "user-activity";
//battery
import {charger, battery } from "power";

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

  /* removing old power hungry method
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
  */
//set current week num on buildtime (so we don't have to wait until night)
//let buildtime_weeknum = current_week_num();
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
//
let v_today = new Date();
let hours = v_today.getHours();
let mins = util.zeroPad(v_today.getMinutes());

clock.ontick = (evt) => {
  let v_today = evt.date;
  let hours = v_today.getHours();
  
  
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(v_today.getMinutes());
  //myTime.text = `${hours}:${mins}`;
  
    /* w40-1 removing this update method, shifting to sleep wakeup (so 7 times a week)
  //update week num on mondays 0100, where getday returns 0=sun through 6=sat
  if ((today.getDay() === 1) && (today.getHours() < 3) && (today.getMinutes()===1)) { //update this three times (because we saw bugs in when this is run)
    //  let buildtime_weeknum = current_week_num();
    buildtime_weeknum_alt = weeknumArr[today.getMonth()][today.getDate()-1];
  }
  */
  myTime.text = `${hours}:${mins}`;
  myMMDD.text = "mm"+util.zeroPad(v_today.getMonth()+1)+"dd"+util.zeroPad(v_today.getDate());
    /* 2022-w40-1
    myDate.text = "W"+buildtime_weeknum+" old";
  */
  myDebug.text = battery.chargeLevel + "%";
  //myDebug.text = "hello"
  //updateSteps(); // removed as of w38-7
};

// w40-1 desire to see that this is updated in the morning
sleep.onchange = (evt) => {
      //buildtime_weeknum_alt = weeknumArr[today.getMonth()][today.getDate()-1];
    update_week_num();  
    myWeekNum.text = "2022-W"+util.zeroPad(buildtime_weeknum_alt)+"-"+v_today.getDay();
      myDate.text = `${hours}:${mins}`;
     };

// w40-1 this will cause an update to the week num (upon charging, or each battery change?)
battery.onchange = (charger, evt) => {
      update_week_num();
      myWeekNum.text = "2022-W"+util.zeroPad(buildtime_weeknum_alt)+"-"+v_today.getDay();
      myDate.text = "charged";
     }

function update_week_num() {
    buildtime_weeknum_alt = weeknumArr[v_today.getMonth()][v_today.getDate()-1];
}
