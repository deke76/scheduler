import React from 'react';
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const dayClass = 
    classNames('day-list__item', {
      'day-list__item--selected': props.selected,
      'day-list__item--full': !props.spots
    });

  const formatSpots = function(spotsRemaining) {
    let stringSpots = (!spotsRemaining) ? 'no' : spotsRemaining; 
    stringSpots += (spotsRemaining !== 1) ? ' spots' : ' spot';
    stringSpots += ' remaining';
    
    return stringSpots;
  }

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)} selected={props.selected}>
      <h2 className='text--regular'>{props.name}</h2>
      <h3 className='text--light'>{formatSpots(props.spots)}</h3>
    </li>
  );
}