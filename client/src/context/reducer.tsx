import NotificationState, { JobType } from "../interfaces/NotificationState";
import ActionTypes from "./actions";

const reducer = (state: NotificationState, action: ActionTypes): any => {
  switch (action.type) {
    case "DISPLAY_ALERT":
      return {
        ...state,
        showAlert: true,
        alertType: "danger",
        alertText: "please provide all values",
      };
    case "CLEAR_ALERT":
      return {
        ...state,
        showAlert: false,
        alertType: "",
        alertText: "",
      };
    case "SETUP_USER_BEGIN":
      return {
        ...state,
        isLoading: true,
      };
    case "SETUP_USER_SUCCESS":
      return {
        ...state,
        user: action.payload?.user,
        token: action.payload?.token,
        userLocation: action.payload?.location,
        jobLocation: action.payload?.location,
        isLoading: false,
        showAlert: true,
        alertType: "success",
        alertText: action.payload?.alertText,
      };
    case "SETUP_USER_ERROR":
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: "danger",
        alertText: action.payload?.msg,
      };
    case "TOGGLE_SIDEBAR":
      return { ...state, showSidebar: !state.showSidebar };
    case "LOGOUT_USER":
      return {
        ...state,
        user: null,
        token: null,
        userLocation: "",
        jobLocation: "",
      };
    case "INPUT_CHANGE":
      return {
        ...state,
        [action.payload!.name!.toString()]: action.payload!.value,
        page:1
      };
    case "CLEAR_JOB":
      return {
        ...state,
        isEditing: false,
        editJobId: "",
        position: "",
        company: "",
        jobType: "full-time",
        status: "pending",
        jobLocation: state.jobLocation,
      };
    case "CREATE_JOB_SUCCESS":
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: "success",
        alertText: "New job created!",
      };
    case "GET_JOB_SUCCESS":
      return {
        ...state,
        isLoading: false,
        jobs: action.payload?.jobs,
        totalJobs: action.payload?.totalJobs,
        numOfPages: action.payload?.numOfPages,
      };
    case "SET_EDIT_JOB":
      const job: JobType | undefined = state.jobs.find(
        (job: JobType) => job._id === action.payload?.id
      );
      if (job) {
        const {
          _id,
          position,
          company,
          jobLocation,
          jobType,
          status,
        }: JobType = job;
        return {
          ...state,
          isEditing: true,
          editJobId: _id,
          position,
          company,
          jobLocation,
          jobType,
          status,
        };
      }
      return { ...state };
    case "DELETE_JOB_BEGIN":
      return {
        ...state,
        isLoading: true,
      };
    case "EDIT_JOB_BEGIN":
      return {
        ...state,
        isLoading: true,
      };
    case "EDIT_JOB_SUCCESS":
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: "success",
        alertText: "Job Updated!",
      };
    case "EDIT_JOB_FAILED":
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: "danger",
        alertText: action.payload?.msg,
      };
    case "SHOW_STATS_BEGIN":
      return {
        ...state,
        isLoading: true,
        showAlert: false,
      };
    case "SHOW_STATS_SUCCESS":
      return {
        ...state,
        isLoading: false,
        defaultStats: action.payload!.defaultStats,
        monthlyApplications: action.payload?.monthlyApplications,
      };
    case "CLEAR_FILTERS":
      return {...state, search: '', searchStatus: "all", searchType: "all", sort: 'latest'};
    case "CHANGE_PAGE":
      return{...state, page: action.payload?.page}

    default:
      throw new Error();
  }
};

export default reducer;
