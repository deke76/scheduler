import React from "react";
import { InterviewerListItem } from '../constants'
import "components/InterviewerList.scss";
import PropTypes from 'prop-types';

// List of interviewers for inclusion when creating a form
export default function InterviewerList(props) {
  
  // Setup the list of interviewers available
  const interviewers = 
    props.interviewers.map(interviewer => 
      <InterviewerListItem
        {...interviewer}
        key={interviewer.id}
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