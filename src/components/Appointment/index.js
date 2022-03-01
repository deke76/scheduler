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

export default function Appointment(props) {
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM = 'CONFIRM';
  const EDIT = 'EDIT';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY);

  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE));
  }

  const cancel = function(id) {
    transition(DELETING, true);
    props.onCancel(id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.state.interviewers[props.interview.interviewer]} 
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)} /> 
      )}

      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={(name, interviewer) => save(name, interviewer)} />
      )}

      {mode === SAVING && <Status message={'Saving'} />}
      {mode === ERROR_SAVE && <Error message={'Could not save.'} onClose={() => back()} />}

      {mode === DELETING && <Status message={'Deleting'} />}
      {mode === ERROR_DELETE && <Error message={'Could not cancel appointment'} onClose={() => back()} />}

      {mode === CONFIRM && (
        <Confirm
          message="Cancel the appointment?"
          onCancel={() => back()} 
          onConfirm={() => cancel(props.id)} 
        />
      )}

      {mode === EDIT && (
        <Form
          placeholder={props.interview.student}
          interviewer={props.interviewers.filter(interviewer => interviewer.id === props.interview.interviewer)[0].id}
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={(name, interviewer) => save(name, interviewer)} 
        />
      )}
    </article>
  )
}