import { useState, useEffect } from "react";
import { URL, DAYS, APPTS, INTERVIEWERS} from '../constants'
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
    const spotsLeft = state.days[0].appointments.filter(apptID => appointments[apptID].interview === null).length;
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
