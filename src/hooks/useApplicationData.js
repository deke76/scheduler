import { useState, useEffect } from "react";
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

  useEffect(() => {
    Promise.all([
      axios.get(daysURL),
      axios.get(appointmentsURL),
      axios.get(interviewersURL)
    ]).then( all => {
      setState(prev => ({...prev, days: all[DAYS].data, appointments: all[APPTS].data, interviewers: all[INTERVIEWERS].data }))
    })
  }, []);

  const addOrEditSpots = function(appointment) {
    return (appointment === null) ? (spots => spots -= 1 ) : (spots => spots );
  }
  const deleteSpot = spots => spots += 1;

  const updateSpots = function(id, callBack) {
    
    const dayDetails = state.days.filter(day => day.name === state.day)[0];
    
    dayDetails.spots = (callBack(dayDetails.spots));
    // const dayID =  dayDetails.id - 1;
    // return { [dayID]: dayDetails }
  }

  const bookInterview = function(id, interview) {
    const days = {
      ...state.days
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
        if (res.status === 204) {
          updateSpots(id, addOrEditSpots(state.appointments[id].interview));
          setAppointments(appointments);  
        }
      });
  }

  const cancelInterview = function(id) {
    const days = {
      ...state.days
    };
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
        updateSpots(id, deleteSpot);
        setAppointments(appointments);
      });
    }

  return { state, setDay, bookInterview, cancelInterview }
}
