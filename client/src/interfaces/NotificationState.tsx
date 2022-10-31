export interface CustomComponentProps extends React.HTMLAttributes<HTMLElement>{
  center?: boolean
  data?: any
}

export interface UserRegisterCredentials {
  name?: string;
  lastName?: string;
  location?: string;
  email: string;
  password?: string;
}

export interface UserSetup {
  currentUser: UserRegisterCredentials;
  endPoint: string;
  alertText: string;
}

export interface JobType {
  position: string;
  status: string;
  jobType: string;
  jobLocation: string;
  company: string;
  createdAt: string;
  _id: string;
}

export interface JobsResponse {
  jobs: [];
  totalJobs: number;
  numOfPages: number;
}

export interface StatsResponse {
  defaultStats: {
    pending: number;
    interview: number;
    declined: number;
  };
  monthlyApplications: { date: string; count: number }[];
}

export interface SearchParams{
  search:string,
  searchStatus: string,
  searchType:string,
  sortOptions?: string[],
  sort:string,
  page:number,
}

export interface JobSetup extends JobsResponse, StatsResponse {
  isEditing: boolean;
  editJobId: string;
  position: JobType["position"];
  company: JobType["company"];
  jobTypeOptions: string[];
  jobType: JobType["jobType"];
  statusOptions: string[];
  status: JobType["status"];
  jobLocation: JobType["jobLocation"];
}

export default interface NotificationState extends JobSetup, SearchParams {
  showSidebar: boolean;
  isLoading: boolean;
  showAlert: boolean;
  alertText: string;
  alertType: string;
  user: UserRegisterCredentials;
  token: string | null;
  userLocation: string;
}
