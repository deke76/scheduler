import { useEffect, useReducer } from "react";
import { URL, DAYS, APPTS, INTERVIEWERS } from '../constants'
import axios from "axios";

export default function useApplicationData() {
  // Reducer setup and functions.
  const reducer = function(state, action) {
    return reducers[action.type](state, action) || state;
  };

  const updateSpots = function(state) {
    // Find the index to use for the state.appointments search
    let currentDay = 0;
    for (const day of state.days) {
      if (day.name === state.day) {
        currentDay = (day.id - 1);
      }
    };
  
    // Find the appointments for the current day that are unfilled (spots still open)
    const spotsLeft = state.days[currentDay].appointments.filter(apptID => state.appointments[apptID].interview === null).length;
  
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

  const reducers = {
    SET_DAY(state, action) {
      return state = ({...state, day: action.day });
    },
    SET_APP_DATA(state, action) {
      return state = ({...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers });
    },
    SET_INTERVIEW(state, action) {
      const { id, interview } = action;
      
      const appointment = {
        ...state.appointments[id],
        interview: !interview ? null : { ...interview }
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      
      const days = updateSpots({ ...state, appointments });

      return state = ({...state, days, appointments });
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
      dispatch({ 
        type: 'SET_APP_DATA',
        days: all[DAYS].data,
        appointments: all[APPTS].data,
        interviewers: all[INTERVIEWERS].data
      }); 
    });

    // enable WebSockets
    // let webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
    // webSocket.onmessage = event => {
    //   const message = JSON.parse(event.data)
    //   console.log(message);
    // };
    
    // if (message.type === 'SET_INTERVIEWS') {
    //   const {id, interview } = message;
    //   return dispatch({type: 'SET_INTERVIEWS', appointments: appointments, days: days });
    // }
    // return () => webSocket.close();
    // }
  }, []);
  
  const setDay = day => dispatch( {type: 'SET_DAY', day: day });
  
  // const updateSpots = function(state) {
  //   // Find the index to use for the state.appointments search
  //   let currentDay = 0;
  //   for (const day of state.days) {
  //     if (day.name === state.day) {
  //       currentDay = (day.id - 1);
  //     }
  //   };
  
  //   // Find the appointments for the current day that are unfilled (spots still open)
  //   const spotsLeft = state.days[currentDay].appointments.filter(apptID => state.appointments[apptID].interview === null).length;
  
  //   // Map the days array and set the number of spots
  //   const dayDeets = state.days.map((day) => {
  //     if (day.name === state.day) {
  //       return {
  //         ...day,
  //         spots: spotsLeft
  //       }
  //     }
  //     return day;
  //   });
  //   return dayDeets;
  // };

  const bookInterview = function(id, interview, axiosRequest) {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: !interview ? null : { ...interview }
    // };

    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };
    
    // const days = updateSpots({ ...state, appointments });
    
    return axiosRequest(`${URL.APPOINTMENTS}/${id}`, { interview })
      .then((res) => {
        if (res.status === 204) {
          dispatch({type: 'SET_INTERVIEW', id, interview });
        }
      });
  }
  return { state, setDay, bookInterview }
}
