import React from "react";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { FormRow, Alert, FormRowSelect } from "../../components/Index";
import { useAppContext } from "../../context/appContext";

const AddJob = () => {
  const {
    isLoading,
    handleInputChange,
    isEditing,
    showAlert,
    clearAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    clearJob,
    createJob,
    editJob
  } = useAppContext();

  const inputChangeHandler = (
    el:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const name = el.target.name;
    const value = el.target.value;
    handleInputChange({name,value});
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company || !position || !jobLocation) {
      displayAlert();
      clearAlert()
      return;
    }
    if(isEditing){
      editJob()
      return
    }

    createJob()

  };
  return (
    <Wrapper>
      <form className="form" aria-label="form" onSubmit={submitHandler}>
        <h3>{isEditing ? "Edit Job" : "Add Job"}</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            name="position"
            type="text"
            value={position}
            handleChange={inputChangeHandler}
            labelText="Position"
          />
          <FormRow
            name="company"
            type="text"
            value={company}
            handleChange={inputChangeHandler}
            labelText="Company"
          />
          <FormRow
            name="jobLocation"
            type="text"
            value={jobLocation}
            handleChange={inputChangeHandler}
            labelText="Location"
          />
          <FormRowSelect
            labelText="Status"
            name="status"
            value={status}
            list={statusOptions}
            handleChange={inputChangeHandler}
          />
          <FormRowSelect
            labelText="Job Type"
            name="jobType"
            value={jobType}
            list={jobTypeOptions}
            handleChange={inputChangeHandler}
          />
          <div className="btn-container">
            <button className="btn btn-block submit-btm" type="submit" disabled={isLoading}>
              submit
            </button>
            <button className="btn btn-block clear-btn" type="button" onClick={clearJob}>clear</button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
