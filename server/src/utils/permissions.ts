import mongoose from "mongoose";
import { UnauthenticatedError } from "../errors";


const checkPermissions =(
  requestUser:{userId:string},
  createdById:{type:mongoose.Types.ObjectId, ref: "User"}) => {
  // if(requestUser.role === 'admin') return
  if (requestUser.userId === createdById.toString()) return;
  throw new UnauthenticatedError("User doesn't have access to this route.");
};

export default checkPermissions;
