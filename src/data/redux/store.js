import  { configureStore } from "@reduxjs/toolkit";
import deviceReducer from './deviceSlice';
import eidReducer from './eidSlice';
// import usersReducer from '../features/users/usersSlice';


export const store = configureStore({
	reducer : {
		device: deviceReducer,
		eid: eidReducer
	}
});