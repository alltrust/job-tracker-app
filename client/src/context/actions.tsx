import { StatsResponse } from "../interfaces/NotificationState";

export interface RegisteredUser {
  user: {
    name: string;
    email: string;
    lastName: string;
    location: string;
  };
  token: string;
  location: string;
}

export default interface ActionTypes {
  type:
    | "DISPLAY_ALERT"
    | "CLEAR_ALERT"
    | "SETUP_USER_BEGIN"
    | "SETUP_USER_ERROR"
    | "SETUP_USER_SUCCESS"
    | "TOGGLE_SIDEBAR"
    | "LOGOUT_USER"
    | "UPDATE_USER_START"
    | "UPDATE_USER_SUCCESS"
    | "UPDATE_USER_ERROR"
    | "INPUT_CHANGE"
    | "CLEAR_JOB"
    | "CREATE_JOB_SUCCESS"
    | "GET_JOB_SUCCESS"
    | "SET_EDIT_JOB"
    | "DELETE_JOB_BEGIN"
    | "EDIT_JOB_BEGIN"
    | "EDIT_JOB_SUCCESS"
    | "EDIT_JOB_FAILED"
    | "SHOW_STATS_BEGIN"
    | "SHOW_STATS_SUCCESS"
    | "CLEAR_FILTERS"
    | "CHANGE_PAGE";
  payload?: {
    user?: RegisteredUser["user"];
    token?: RegisteredUser["token"];
    location?: RegisteredUser["location"];
    msg?: string;
    alertText?: string;
    name?: string;
    value?: string;
    jobs?: [];
    totalJobs?: number;
    numOfPages?: number;
    id?: string;
    defaultStats?: StatsResponse["defaultStats"];
    monthlyApplications?: StatsResponse["monthlyApplications"];
    page?: number
  };
}
