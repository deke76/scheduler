import Button from "components/Button";
import DayListItem from "../components/DayListItem";
import InterviewerList from "../components/InterviewerList";
import Header from "../components/Appointment/Header";
import Show from "../components/Appointment/Show";
import Empty from "../components/Appointment/Empty";
import Form from "../components/Appointment/Form";
import Status from "../components/Appointment/Status";
import Error from "../components/Appointment/Error"
import useVisualMode from "hooks/useVisualMode";
import Confirm from "../components/Appointment/Confirm";
import InterviewerListItem from "components/InterviewerListItem";
import DayList from "../components/DayList";
import Appointment from "../components/Appointment";
import useApplicationData from '../hooks/useApplicationData'
import Application from "components/Application";
import { getAppointmentsForDay, getInterviewersForDay } from "../helpers/selector";
export { Button, DayListItem,
         InterviewerList, Header, 
         Show, Empty, Form, 
         Status, Error, Confirm, 
         useVisualMode, InterviewerListItem,
         DayList, Appointment,
         useApplicationData, Application,
         getAppointmentsForDay,
         getInterviewersForDay };

export const SCREENS = {
  EMPTY : 'EMPTY',
  SHOW : 'SHOW',
  CREATE : 'CREATE',
  SAVING : 'SAVING',
  DELETING : 'DELETING',
  CONFIRM : 'CONFIRM',
  EDIT : 'EDIT',
  ERROR_SAVE : 'ERROR_SAVE',
  ERROR_DELETE : 'ERROR_DELETE'
}

export const URL = {
  DAYS : '/api/days',
  APPOINTMENTS : '/api/appointments',
  INTERVIEWERS :'/api/interviewers'
}

export const DAYS = 0; 
export const APPTS = 1; 
export const INTERVIEWERS = 2;