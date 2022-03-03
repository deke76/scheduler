import React from "react";
import { DayListItem } from "../constants";

export default function DayList(props) {
  const days = 
    props.days.map(day =>
      <DayListItem
      key={day.id}
      {...day}
      selected={day.name === props.value}
      setDay={(event) => props.onChange(day.name)}
    />);
  
  return (
    <ul>
      { days }
    </ul>
  )
}