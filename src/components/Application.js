import React from "react";
import axios from "axios";
import "components/Application.scss";
import { DayList, Appointment, useApplicationData, getAppointmentsForDay, getInterviewersForDay } from "../constants";

// Main application file
export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const dailyInterviewers = getInterviewersForDay(state, state.day);
  const dailyAppointments =
    getAppointmentsForDay(state, state.day).map(appointment => (
      <Appointment
        key={appointment.id}
        {...appointment}
        interviewers={dailyInterviewers}
        state={state}
        bookInterview={(id, interview) => bookInterview(id, interview, axios.put)}
        onCancel={(id) => bookInterview(id, null, axios.delete)}
      />));
    
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={ setDay } />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        { dailyAppointments }
        <Appointment key={'last'} time={'5pm'} />
      </section>
    </main>
  );
}
