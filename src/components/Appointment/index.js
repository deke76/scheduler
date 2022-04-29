import React, { useEffect } from "react";
import "./styles.scss";
import { SCREENS, Header, Show, Empty, Form, Status, Error, Confirm, useVisualMode } from '../../constants';
import axios from 'axios';

// Appointment screen that handles placement of interview slots and screen setting
export default function Appointment(props) {

  // Bring in the current screen mode and functions to transition screens forward and back
  const { mode, transition, back } = useVisualMode(props.interview ? SCREENS.SHOW : SCREENS.EMPTY);
  
  useEffect(() => {
    if (props.interview && mode === SCREENS.EMPTY) {
     transition(SCREENS.SHOW);
    }
    if (props.interview === null && mode === SCREENS.SHOW) {
     transition(SCREENS.EMPTY);
    }
   }, [props.interview, transition, mode]);  


  // Save an appointment and call the bookInterview function found in the useApplicationData (passed as a prop)
  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SCREENS.SAVING);
    props.bookInterview(props.id, interview, axios.put)
      .then(() => transition(SCREENS.SHOW))
      .catch(error => transition(SCREENS.ERROR_SAVE));
  }

  // Delete an appointment and begin the call to cancelInterview through the callback function onCancel (passed as a prop)
  const cancel = function(id) {
    transition(SCREENS.DELETING, true);
    props.onCancel(id)
      .then(() => transition(SCREENS.EMPTY))
      .catch(error => {console.log(error); transition(SCREENS.ERROR_DELETE, true)});
  }

  return (
    <article className='appointment'>
      <Header time={props.time} />

      {/* Set the interview screens based upon the current state (mode) */}
      {mode === SCREENS.EMPTY && <Empty onAdd={() => transition(SCREENS.CREATE)} />}
      {mode === SCREENS.SAVING && <Status message={'Saving'} />}
      {mode === SCREENS.ERROR_SAVE && <Error message={'Could not save.'} onClose={() => back()} />}
      {mode === SCREENS.DELETING && <Status message={'Deleting'} />}
      {mode === SCREENS.ERROR_DELETE && <Error message={'Could not cancel appointment'} onClose={() => back()} />}
      {mode === SCREENS.SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.state.interviewers[props.interview.interviewer]} 
          onEdit={() => transition(SCREENS.EDIT)}
          onDelete={() => transition(SCREENS.CONFIRM)} /> 
      )}
      {mode === SCREENS.CONFIRM && (
        <Confirm
          message="Cancel the appointment?"
          onCancel={() => back()} 
          onConfirm={() => cancel(props.id)} 
        />
      )}
      {mode === SCREENS.CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={(name, interviewer) => save(name, interviewer)} />
      )}
      {mode === SCREENS.EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interviewers.filter(interviewer => interviewer.id === props.interview.interviewer)[0].id}
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={(name, interviewer) => save(name, interviewer)} 
        />
      )}
    </article>
  )
}