export function getAppointmentsForDay(state, day) {
  const arrayDayAppointments = [];
  if(state.days.length) {
    let i = 0;
    let dayFound = false;
    while (!dayFound && (i < state.days.length) && Object.prototype.hasOwnProperty.call(state.days[i], 'name')) {
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

export function getInterviewersForDay(state, day) {
  const arrayDayInterviewers = [];
  if(state.days.length) {
    let i = 0;
    let dayFound = false;
    while (!dayFound && (i < state.days.length) && Object.prototype.hasOwnProperty.call(state.days[i], 'name')) {
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
  const interviewDetails = (interview === null) ? null : {};

  if (interview !== null) {
    interviewDetails.student = interview.student;
    interviewDetails.interviewer = state.interviewers[interview.interviewer];
  }  

  return interviewDetails;
}