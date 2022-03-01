import { useState, useEffect } from "react";
import { getAppointmentsForDay } from "helpers/selector";
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

  const updateSpots = function(id) {
    const dayDetails = [...state.days].filter(day => day.name === state.day)[0];
    dayDetails.spots += 1;
    const dayID =  dayDetails.id - 1;
    console.log(dayID, dayDetails);
    return { [dayID]: dayDetails }
  }

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
    console.log(state.appointments[id]);
    const dayDetails = state.days.filter(day => day.name === state.day)[0];
    dayDetails.spots -= 1;
    const dayID =  dayDetails.id - 1;

    console.log(dayID);
    console.log(dayDetails);
    
    const days = {
      ...state.days,
      [dayID]: dayDetails
    };
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
    
    const newDay = updateSpots(id);
    console.log(newDay);
    const days = {
      ...state.days,
      // [dayID]: dayDetails
    };
    const appointment = {
    ...state.appointments[id],
    interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    console.log(state);
    console.log(state.days);
    console.log(days);

    return axios
      .delete(`${appointmentsURL}/${id}`, appointments)
      .then((res) => {
        setAppointments(appointments);
      });
    }

  return { state, setDay, bookInterview, cancelInterview }
}
