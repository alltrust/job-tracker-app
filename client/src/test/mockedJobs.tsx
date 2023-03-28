interface IJob{
  _id:string,
  company:string,
  createdAt:string,
  jobLocation:string,
  jobType: string,
  position: string,
  status:string
}

const jobs:IJob[] = [
    {
      _id: "1",
      company: "CAPS",
      createdAt: "2023-03-23T13:54:43.875Z",
      jobLocation: "ONTARIO",
      jobType: "full-time",
      position: "FRONT-END",
      status: "pending",
    },
    {
      _id: "2",
      company: "LOWERCASE",
      createdAt: "2023-03-23T13:54:43.875Z",
      jobLocation: "QUEBEC",
      jobType: "part-time",
      position: "BACK-END",
      status: "pending",
    },
    {
      _id: "3",
      company: "JOB 3",
      createdAt: "2023-03-23T13:54:43.875Z",
      jobLocation: "JOOB 3 LOC",
      jobType: "part-time",
      position: "BACK-END",
      status: "pending",
    },
    {
      _id: "4",
      company: "JOB 4",
      createdAt: "2023-03-23T13:54:43.875Z",
      jobLocation: "JOB 4 LOCATION",
      jobType: "part-time",
      position: "BACK-END",
      status: "pending",
    },
    // {
    //   _id: "5",
    //   company: "JOB 5",
    //   createdAt: "2023-03-23T13:54:43.875Z",
    //   jobLocation: "JOB 5 LOCATION",
    //   jobType: "part-time",
    //   position: "JOB 5",
    //   status: "pending",
    // },
  ];

  export {jobs}