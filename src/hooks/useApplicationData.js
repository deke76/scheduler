import { useState, useEffect, useReducer } from "react";
import { URL, DAYS, APPTS, INTERVIEWERS } from '../constants'
import axios from "axios";

export default function useApplicationData() {
  // Reducer setup and functions.
  const reducer = function(state, action) {
    return reducers[action.type](state, action) || state;
  };

  const reducers = {
    SET_DAY(state, action) {
      return state = ({...state, day: action.day });
    },
    SET_APP_DATA(state, action) {
      return state = ({...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers });
    },
    SET_INTERVIEWS(state, action) {
      return state = ({...state, days: action.days, appointments: action.appointments });
    }
  };

  const [state, dispatch] = useReducer(reducer, {
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
      dispatch({ type: 'SET_APP_DATA', days: all[DAYS].data, appointments: all[APPTS].data, interviewers: all[INTERVIEWERS].data } ) 
      // (prev => ({...prev, days: all[DAYS].data, appointments: all[APPTS].data, interviewers: all[INTERVIEWERS].data }))
    })
  }, []);
  
  const setDay = day => dispatch( {type: 'SET_DAY', day: day });
  
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
          dispatch({type: 'SET_INTERVIEWS', appointments: appointments, days: days });
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
        dispatch({type: 'SET_INTERVIEWS', appointments: appointments, days: days });
      });
    }

  return { state, setDay, bookInterview, cancelInterview }
}
