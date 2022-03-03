import React, { useState } from 'react';
import { Button, InterviewerList } from '../../constants'

export default function Form(props) {
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [student, setStudent] = useState(props.student || "");
  const [error, setError] = useState("");

  const reset = function() {
    setError("");
    setStudent("");
    setInterviewer("");
  }
  
  const cancel = function() {
    reset();
    props.onCancel();
  }

  const validate = function() {
    console.log(interviewer)
    if (student === "") {
      setError("Student name cannot be blank")
      return;
    }
    setError("");
    props.onSave(student, interviewer)
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            data-testid={"student-name-input"}
            name="name"
            type="text"
            placeholder={"Enter Student Name"}
            value={student}
            onChange={(event) => setStudent(event.target.value)} />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList 
            interviewers={props.interviewers}
            value={interviewer}
            onChange={ setInterviewer }
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          {student && interviewer && <Button confirm onClick={validate}>Save</Button>}
        </section>
      </section>
    </main>
  )
}