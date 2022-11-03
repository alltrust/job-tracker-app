import React, { useReducer, useContext } from "react";
import axios, { AxiosError } from "axios";

import { RegisteredUser } from "./actions";
import NotificationState, {
  UserSetup,
  JobsResponse,
  JobType,
  StatsResponse,
  SearchParams,
} from "../interfaces/NotificationState";
import reducer from "./reducer";

interface ChildrenProps {
  children: React.ReactNode;
}

const user: string | null = localStorage.getItem("user");
const userToken: string | null = localStorage.getItem("token");
const userLocation: string | null = localStorage.getItem("location");

const initialState: NotificationState = {
  showSidebar: false,
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: userToken,
  userLocation: userLocation || "",
  jobLocation: userLocation || "",
  isEditing: false,
  editJobId: "",
  position: "",
  company: "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["pending", "interview", "declined"],
  status: "pending",
  search: "",
  searchStatus: "all",
  searchType: "all",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
  sort: "latest",
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  defaultStats: {
    pending: 0,
    interview: 0,
    declined: 0,
  },
  monthlyApplications: [],
};

interface ChangeHandlerInputs {
  name: string;
  value: string;
}

export interface AllContext extends NotificationState {
  displayAlert: () => void;
  clearAlert: () => void;
  setUpUser: ({ currentUser, endPoint, alertText }: UserSetup) => Promise<void>;
  logoutUser: () => void;
  toggleSidebar: () => void;
  updateUser: ({
    name,
    location,
    email,
    lastName,
  }: UserSetup["currentUser"]) => Promise<void>;
  handleInputChange: ({ name, value }: ChangeHandlerInputs) => void;
  clearJob: () => void;
  createJob: () => Promise<void>;
  getJobs: () => Promise<void>;
  editJob: () => Promise<void>;
  setEditJob: (id: string) => void;
  deleteJob: (id: string) => Promise<void>;
  showStats: () => Promise<void>;
  clearFilter: () => void;
  changePage: (page: number) => void;
}

const AppContext = React.createContext({} as AllContext);

const AppProvider = ({ children }: ChildrenProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: "http://localhost:4000/api/v1",
  });
  authFetch.interceptors.request.use(
    (config) => {
      config.headers!["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: "DISPLAY_ALERT" });
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: "CLEAR_ALERT" });
    }, 4000);
  };

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const handleInputChange = ({ name, value }: ChangeHandlerInputs) => {
    dispatch({ type: "INPUT_CHANGE", payload: { name: name, value: value } });
  };

  const clearFilter = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  const clearJob = () => {
    dispatch({ type: "CLEAR_JOB" });
  };

  const changePage = (page: number) => {
    dispatch({ type: "CHANGE_PAGE", payload: { page } });
  };

  const addUserToLocalStorage = ({ user, token, location }: RegisteredUser) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("location");
  };

  const setUpUser = async ({ currentUser, endPoint, alertText }: UserSetup) => {
    try {
      dispatch({ type: "SETUP_USER_BEGIN" });

      const response = await axios.post(
        `http://localhost:4000/api/v1/auth/${endPoint}`,
        currentUser
      );
      const { user, token, location }: RegisteredUser = response.data;

      dispatch({
        type: "SETUP_USER_SUCCESS",
        payload: { user, token, location, alertText },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (err) {
      const errors = err as Error | AxiosError;

      if (!axios.isAxiosError(errors)) {
        dispatch({
          type: "SETUP_USER_ERROR",
          payload: { msg: `${errors.cause}` },
        });
      } else {
        dispatch({
          type: "SETUP_USER_ERROR",
          payload: { msg: errors.response?.data.message },
        });
      }
    }

    clearAlert();
  };

  const updateUser = async ({
    name,
    lastName,
    email,
    location,
  }: UserSetup["currentUser"]) => {
    dispatch({ type: "SETUP_USER_BEGIN" });
    const currentUser = { name, lastName, email, location };

    try {
      const response = await authFetch.patch("/auth/updateUser", currentUser);
      const { user, location, token }: RegisteredUser = response.data;

      dispatch({
        type: "SETUP_USER_SUCCESS",
        payload: { user, location, token, alertText: "Updated user Profile!" },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (err) {
      const errors = err as Error | AxiosError;

      if (!axios.isAxiosError(errors)) {
        dispatch({
          type: "SETUP_USER_ERROR",
          payload: { msg: `${errors.cause}` },
        });
      } else {
        if (errors.response?.status !== 401) {
          dispatch({
            type: "SETUP_USER_ERROR",
            payload: { msg: `${errors.response?.data.message}` },
          });
        }
      }
    }
    clearAlert();
  };

  const logoutUser = () => {
    dispatch({ type: "LOGOUT_USER" });
    removeUserFromLocalStorage();
  };

  const createJob = async () => {
    dispatch({ type: "SETUP_USER_BEGIN" });

    const { position, company, jobType, status, jobLocation } = state;
    const currentJob = { position, company, jobLocation, status, jobType };

    try {
      await authFetch.post("/jobs", currentJob);
      dispatch({ type: "CREATE_JOB_SUCCESS" });
      dispatch({ type: "CLEAR_JOB" });
    } catch (err) {
      const errors = err as Error | AxiosError;

      if (!axios.isAxiosError(errors)) {
        dispatch({
          type: "SETUP_USER_ERROR",
          payload: { msg: `${errors.cause}` },
        });
      } else {
        if (errors.response?.status === 401) return;

        dispatch({
          type: "SETUP_USER_ERROR",
          payload: { msg: errors.response?.data.message },
        });
      }
    }

    clearAlert();
  };

  const getJobs = async () => {
    const { search, searchStatus, searchType, sort, page }: SearchParams =
      state;
    let url: string = `jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

    if (search) {
      url = url + `&search=${search}`;
    }

    dispatch({ type: "SETUP_USER_BEGIN" });
    try {
      const response = await authFetch(url);
      const { jobs, totalJobs, numOfPages }: JobsResponse = response.data;
      dispatch({
        type: "GET_JOB_SUCCESS",
        payload: { jobs, totalJobs, numOfPages },
      });
    } catch (err) {
      logoutUser();
    }
  };

  const setEditJob = (id: string) => {
    dispatch({ type: "SET_EDIT_JOB", payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: "EDIT_JOB_BEGIN" });
    const { jobLocation, position, company, jobType, status }: JobType = state;
    const currentJob = { jobLocation, position, company, jobType, status };

    try {
      await authFetch.patch(`/jobs/${state.editJobId}`, currentJob);

      dispatch({ type: "EDIT_JOB_SUCCESS" });
      dispatch({ type: "CLEAR_JOB" });
    } catch (err) {
      const errors = err as Error | AxiosError;

      if (!axios.isAxiosError(errors)) {
        dispatch({
          type: "SETUP_USER_ERROR",
          payload: { msg: `${errors.cause}` },
        });
      } else {
        if (errors.response?.status === 401) return;
        dispatch({
          type: "SETUP_USER_ERROR",
          payload: { msg: errors.response?.data.message },
        });
      }
    }
  };

  const deleteJob = async (id: string) => {
    dispatch({ type: "DELETE_JOB_BEGIN" });
    try {
      await authFetch.delete(`/jobs/${id}`);
      getJobs();
      return;
    } catch (err) {
      logoutUser();
    }
  };

  const showStats = async () => {
    dispatch({ type: "SHOW_STATS_BEGIN" });
    try {
      const response = await authFetch("/jobs/stats");
      const { defaultStats, monthlyApplications }: StatsResponse =
        response.data;

      dispatch({
        type: "SHOW_STATS_SUCCESS",
        payload: {
          defaultStats: defaultStats,
          monthlyApplications: monthlyApplications,
        },
      });
    } catch (err) {
      logoutUser();
    }
    clearAlert();
  };

  const valuesObj: AllContext = {
    showSidebar: state.showSidebar,
    isLoading: state.isLoading,
    showAlert: state.showAlert,
    alertText: state.alertText,
    alertType: state.alertType,
    user: state.user,
    token: state.token,
    userLocation: state.userLocation,
    jobLocation: state.jobLocation,
    displayAlert,
    clearAlert,
    setUpUser,
    logoutUser,
    toggleSidebar,
    updateUser,
    handleInputChange,
    clearJob,
    createJob,
    getJobs,
    editJob,
    setEditJob,
    deleteJob,
    showStats,
    clearFilter,
    changePage,
    isEditing: state.isEditing,
    editJobId: state.editJobId,
    position: state.position,
    company: state.company,
    jobTypeOptions: state.jobTypeOptions,
    jobType: state.jobType,
    statusOptions: state.statusOptions,
    status: state.status,
    jobs: state.jobs,
    totalJobs: state.totalJobs,
    page: state.page,
    numOfPages: state.numOfPages,
    defaultStats: state.defaultStats,
    monthlyApplications: state.monthlyApplications,
    search: state.search,
    searchStatus: state.searchStatus,
    searchType: state.searchType,
    sort: state.sort,
    sortOptions: state.sortOptions,
  };

  return (
    <AppContext.Provider value={valuesObj}>{children}</AppContext.Provider>
  );
};

export const useAppContext = (): AllContext => {
  return useContext(AppContext);
};

export { AppProvider };
