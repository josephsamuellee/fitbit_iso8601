import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myTime = document.getElementById("myTime");
const myDate = document.getElementById("myDate");
const myDebug = document.getElementById("myDebug");

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
  if ((today.getDay() === 1) && (today.getHours() === 0) {
    // re-write week numbers on mondays at 
    let buildtime_weeknum = current_week_num();
    //let buildtime_weeknum = util.zeroPad(buildtime_weeknum)
  }
  myTime.text = `${hours}:${mins}`;
  myDate.text = "W"+buildtime_weeknum+" "+util.zeroPad(today.getMonth()+1)+"."+util.zeroPad(today.getDate());
  myDebug.text = today.getDay();
}
