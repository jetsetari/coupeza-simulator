import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
	clients: [],
};

const eidSlice = createSlice({
	name: 'clients',
	initialState,
	reducers: {
		clientAdded: {
			reducer(state, action) {
				state.clients.push(action.payload)
			},
			prepare(first_name, last_name, gender, address, pic) {
				return {
					payload: {
						id: nanoid(),  first_name,  last_name,  gender,  address,  pic
					}
				}
			}
		}
	}
});

export const selectAllClients = (state) => state.clients;
export const { clientAdded } = eidSlice.actions; 
export default eidSlice.reducer;