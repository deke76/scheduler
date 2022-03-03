import React from "react"
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error"
import useVisualMode from "hooks/useVisualMode";
import { SCREENS } from '../../constants'

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SCREENS.SHOW : SCREENS.EMPTY);

  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SCREENS.SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SCREENS.SHOW))
      .catch(error => transition(SCREENS.ERROR_SAVE));
  }

  const cancel = function(id) {
    transition(SCREENS.DELETING, true);
    props.onCancel(id)
      .then(() => transition(SCREENS.EMPTY))
      .catch(error => {console.log(error); transition(SCREENS.ERROR_DELETE, true)});
  }

  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === SCREENS.EMPTY && <Empty onAdd={() => transition(SCREENS.CREATE)} />}
      {mode === SCREENS.SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.state.interviewers[props.interview.interviewer]} 
          onEdit={() => transition(SCREENS.EDIT)}
          onDelete={() => transition(SCREENS.CONFIRM)} /> 
      )}

      {mode === SCREENS.SAVING && <Status message={'Saving'} />}
      {mode === SCREENS.ERROR_SAVE && <Error message={'Could not save.'} onClose={() => back()} />}

      {mode === SCREENS.DELETING && <Status message={'Deleting'} />}
      {mode === SCREENS.ERROR_DELETE && <Error message={'Could not cancel appointment'} onClose={() => back()} />}

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