import { useState } from "react";
import { FormRow, Alert } from "../../components/Index";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const Profile = () => {
  const { user, isLoading, displayAlert, updateUser, showAlert,clearAlert } = useAppContext();
  const initialValue = {
    name: user.name!,
    lastName: user.lastName!,
    email: user.email!,
    location: user.location!,
  };
  const [userProfile, setUserProfile] = useState(initialValue);
  const inputChangeHandler = (el: React.ChangeEvent<HTMLInputElement>| React.ChangeEvent<HTMLSelectElement>) => {
    setUserProfile({ ...userProfile, [el.target.name]: el.target.value });
   
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
 
    const {name,lastName,email,location} = userProfile
    if(!name || !lastName || !email || !location){
        displayAlert();
        clearAlert()
        return
    }
    updateUser({name,lastName,location,email})
    
  };
  return (
    <Wrapper>
      <form className="form" onSubmit={submitHandler}>
        <h3>Profile</h3>
        {showAlert && <Alert/>}
        <div className="form-center">
          <FormRow
            name="name"
            type="text"
            value={userProfile.name}
            handleChange={inputChangeHandler}
            labelText="Name"
          />
          <FormRow
            name="lastName"
            type="text"
            value={userProfile.lastName}
            handleChange={inputChangeHandler}
            labelText="Last Name"
          />
          <FormRow
            name="email"
            type="email"
            value={userProfile.email}
            handleChange={inputChangeHandler}
            labelText="E-mail"
          />
          <FormRow
            name="location"
            type="text"
            value={userProfile.location}
            handleChange={inputChangeHandler}
            labelText="location"
          />
          <button type="submit" className="btn btn-block" disabled={isLoading}>
            {isLoading ? "Please wait ..." : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
