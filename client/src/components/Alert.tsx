import { useAppContext } from "../context/appContext";

const Alert = () => {
  const {alertText, alertType} = useAppContext()
  return <div className={`alert alert-${alertType}`} role="alert">{alertText}</div>;
};

export default Alert;
