import React from 'react';
import { InterviewerList } from "../../constants"

// Show a booked appointment with the student name and interviewer name & avatar
export default function Show(props) {
  return (
    <main className="appointment__card appointment__card--show">
      <section className="appointment__card-left">
        <h2 className="text--regular">{props.student}</h2>
        <section className="interviewer">
          <h4 className="interviewers_header text--light">Interviewer</h4>
          <InterviewerList interviewers={[props.interviewer]} value={props.interviewer.id}/>
        </section>
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <img
            className="appointment__actions-button"
            src="images/edit.png"
            alt="Edit"
            onClick={() => props.onEdit()}
          />
          <img
            className="appointment__actions-button"
            src="images/trash.png"
            alt="Delete"
            onClick={() => props.onDelete(props)}
          />
        </section>
      </section>
    </main>
  )
}