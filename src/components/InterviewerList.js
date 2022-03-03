import React from "react";
import { InterviewerListItem } from '../constants'
import "components/InterviewerList.scss";
import PropTypes from 'prop-types';

export default function InterviewerList(props) {
  const interviewers = 
    props.interviewers.map(interviewer => 
      <InterviewerListItem
        key={interviewer.id}
        {...interviewer}
        selected={interviewer.id === props.value}
        setInterviewer={(event) => props.onChange(interviewer.id)}        
      />);

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text-light">{props.interviewers.length > 1 && 'Interviewers'}</h4>
      <ul className="interviewers__list">
        { interviewers }
      </ul>
    </section>
  )
}

InterviewerList.propTypes= {
  interviewers: PropTypes.array.isRequired
};