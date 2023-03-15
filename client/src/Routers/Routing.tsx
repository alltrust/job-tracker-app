import {Routes, Route} from 'react-router-dom';
import {AddJob, AllJobs, Profile, SharedLayout, Stats} from "../pages/dashboard/index";
import {Landing, Error, Register} from "../pages/Index"
import ProtectedRoute from '../pages/ProtectedRoute';

const Routing = ()=>{
    return(
        <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    )
}

export default Routing