// Get a list of the appointments for the day from the state
export function getAppointmentsForDay(state, day) {
  // Setup the return array
  const arrayDayAppointments = [];

  // Make sure the current state isn't empty
  if(state.days.length) {
    let i = 0;
    let dayFound = false;

    // loop through the state.days by each day in order to find the current day (from parameters).
    // make sure that the day we're looing for exists
    while (!dayFound && (i < state.days.length) && Object.prototype.hasOwnProperty.call(state.days[i], 'name')) {
      // once the day is found push each appointment onto the return array and set loop exit condition
      if (state.days[i].name === day) {
        state.days[i].appointments.forEach( appointment => {
          arrayDayAppointments.push(state.appointments[appointment]);
        })
        dayFound = true;
      }
      i++;
    };  
  }
  return arrayDayAppointments;
}

// Get a list of people available for intervies for the day
export function getInterviewersForDay(state, day) {
  // Setup the return array
  const arrayDayInterviewers = [];

  // Make sure the current state isn't empty
  if(state.days.length) {
    let i = 0;
    let dayFound = false;

    // loop through the state.days by each day in order to find the current day (from parameters).
    // make sure that the day we're looing for exists
    while (!dayFound && (i < state.days.length) && Object.prototype.hasOwnProperty.call(state.days[i], 'name')) {
      // once the day is found push the available interviewers onto return array and set loop exit condition
      if (state.days[i].name === day) {
        state.days[i].interviewers.forEach( interviewer => {
          arrayDayInterviewers.push(state.interviewers[interviewer]);
        })
        dayFound = true;
      }
      i++;
    };  
  }
  return arrayDayInterviewers;
}

export function getInterview(state, interview) {
  // Setup return value based on input
  const interviewDetails = (interview === null) ? null : {};

  // Make sure interview exists, if it does grab student and interviewer
  if (interview !== null) {
    interviewDetails.student = interview.student;
    interviewDetails.interviewer = state.interviewers[interview.interviewer];
  }  

  return interviewDetails;
}