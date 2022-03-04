import React from 'react';

// Empty interview, used to call the Form to create an appointment.
export default function Empty(props) {

  return (
    <main className="appointment__add">
      <img 
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        onClick={props.onAdd}
      />
    </main>
  )
}