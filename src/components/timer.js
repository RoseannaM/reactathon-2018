import React from "react";
import styled from "styled-components";

function millisecondsToStr(milliseconds) {
  // TIP: to find current time in milliseconds, use:
  // var  current_time_milliseconds = new Date().getTime();

  function numberEnding(number) {
    return number > 1 ? "s" : "";
  }

  var temp = Math.floor(milliseconds / 1000);
  var years = Math.floor(temp / 31536000);
  if (years) {
    return years + " year" + numberEnding(years);
  }
  //TODO: Months! Maybe weeks?
  var days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + " day" + numberEnding(days);
  }
  var hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + " hour" + numberEnding(hours);
  }
  var minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + " minute" + numberEnding(minutes);
  }
  var seconds = temp % 60;
  if (seconds) {
    return seconds + " second" + numberEnding(seconds);
  }
  return "less than a second"; //'just now' //or other string you like;
}

export class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      eventStartTime: Date.now() + 60 * 1000 * 5
    };
    setInterval(
      () =>
        this.setState({
          timeNow: Date.now()
        }),
      1000
    );
  }
  render() {
    const timeLeft = Math.max(
      0,
      this.state.eventStartTime - this.state.timeNow
    );

    return millisecondsToStr(timeLeft);
  }
}
