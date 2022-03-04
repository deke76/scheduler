import { useState, useEffect } from "react";
import { URL, DAYS, APPTS, INTERVIEWERS } from '../constants'
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get(URL.DAYS),
      axios.get(URL.APPOINTMENTS),
      axios.get(URL.INTERVIEWERS)
    ]).then( all => {
      setState(prev => ({...prev, days: all[DAYS].data, appointments: all[APPTS].data, interviewers: all[INTERVIEWERS].data }))
    })
  }, []);

  const setDay = day => setState({...state, day });

  const updateSpots = function(appointments) {
    // Find the index to use for the state.appointments search
    let currentDay = 0;
    for (const day of state.days) {
      if (day.name === state.day) {
        currentDay = (day.id - 1);
      }
    };

    // Find the appointments for the current day that are unfilled (spots still open)
    const spotsLeft = state.days[currentDay].appointments.filter(apptID => appointments[apptID].interview === null).length;

    // Map the days array and set the number of spots
    const dayDeets = state.days.map((day) => {
      if (day.name === state.day) {
        return {
          ...day,
          spots: spotsLeft
        }
      }
      return day;
    });
    return dayDeets;
  };

  const bookInterview = function(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(appointments);
    
    return axios
      .put(`${URL.APPOINTMENTS}/${id}`, appointment)
      .then((res) => {
        if (res.status === 204) {
          setState(prev => ({ ...prev, appointments: appointments, days: days }));
        }
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
    const days = updateSpots(appointments);
    
    return axios
      .delete(`${URL.APPOINTMENTS}/${id}`, appointments)
      .then((res) => {
        setState(prev => ({ ...prev, appointments: appointments, days: days }));
      });
    }

  return { state, setDay, bookInterview, cancelInterview }
}
