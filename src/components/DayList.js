import React from "react";
import { DayListItem } from "../constants";

// Show the list of days in the side navigation bar
export default function DayList(props) {
  
  // Set up the list of days from an array passed in from main application
  const days = 
    props.days.map(day =>
      <DayListItem
      {...day}
      key={day.id}
      selected={day.name === props.value}
      setDay={(event) => props.onChange(day.name)}
    />);
  
  return (
    <ul>
      { days }
    </ul>
  )
}