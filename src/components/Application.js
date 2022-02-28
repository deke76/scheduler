import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterviewersForDay } from "helpers/selector";

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({...state, day });

  useEffect(() => {
    const daysURL = '/api/days';
    const appointmentsURL = '/api/appointments';
    const interviewersURL = '/api/interviewers';
    const DAYS = 0; const APPTS = 1; const INTERVIEWERS = 2 ; 

    Promise.all([
      axios.get(daysURL),
      axios.get(appointmentsURL),
      axios.get(interviewersURL)
    ]).then( all => {
      setState(prev => ({...prev, days: all[DAYS].data, appointments: all[APPTS].data, interviewers: all[INTERVIEWERS].data }))
    })
  }, []);

  const dailyInterviewers = getInterviewersForDay(state, state.day);
  console.log(dailyInterviewers);

  const dailyAppointments =
    getAppointmentsForDay(state, state.day).map(appointment => (
      <Appointment
        key={appointment.id}
        {...appointment}
        interviewers={dailyInterviewers}
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
