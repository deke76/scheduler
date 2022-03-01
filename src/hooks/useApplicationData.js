import { useState, useEffect } from "react";
// import { getAppointmentsForDay } from "helpers/selector";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  const daysURL = '/api/days';
  const appointmentsURL = '/api/appointments';
  const interviewersURL = '/api/interviewers';
  const DAYS = 0; const APPTS = 1; const INTERVIEWERS = 2 ;

  const setDay = day => setState({...state, day });
  const setAppointments = (appointments) => setState({...state, appointments});

  // const updateSpots = function(id) {
  //   let spotsRemaining = getAppointmentsForDay(state, state.day).filter( appointment => appointment.interview === null).length;
  //   console.log(state.appointments[id]);
  //   return spotsRemaining
  // }

  useEffect(() => {
    Promise.all([
      axios.get(daysURL),
      axios.get(appointmentsURL),
      axios.get(interviewersURL)
    ]).then( all => {
      setState(prev => ({...prev, days: all[DAYS].data, appointments: all[APPTS].data, interviewers: all[INTERVIEWERS].data }))
    })
  }, []);

  const bookInterview = function(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios
      .put(`${appointmentsURL}/${id}`, appointment)
      .then((res) => {
        if (res.status === 204) setAppointments(appointments);
      });
  }

  const cancelInterview = function(id) {

    const appointment = {
    ...state.appointments[id],
    interview: null
  };
  const appointments = {
    ...state.appointments,
    [id]: appointment
  };
  return axios
    .delete(`${appointmentsURL}/${id}`, appointments)
    .then((res) => {
      setAppointments(appointments);
    });
  }

  return { state, setDay, bookInterview, cancelInterview }
}
