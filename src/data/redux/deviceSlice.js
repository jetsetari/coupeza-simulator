import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
	status: { on: false, id: false, light: false, name: false }, 
	data: { id: false, txt: false, type: false, data: false }
};

export const deviceSlice = createSlice({
	name : 'device',
	initialState,
	reducers: {
		toggleDevice: (state) => {
			if(state.status.on) {
				state.status.light = false;
				state.status.on = false;
				state.data.txt = false;
			} else {
				state.status.light = 'on';
				state.status.on = true;
			}
		},
		setDeviceId: (state, action) => {
			state.status.id = action.payload;
		},
		setDeviceName : (state, action) => {
			state.status.name = action.payload;
		},
		setToInitial: (state) => {
			state.data = { txt: false, type: false, id: false, data: false };
			state.status.light = (state.status.on) ? 'on' : false;
		},
		fullResetDevice: (state) => {
			state.status = { on: false, id: false, light: false, name: false };
			state.data = { id: false, txt: false, type: false, data: false };
		},
		setStatus: {
			reducer(state, action) {
				state.data = action.payload;
				state.status.light = action.payload.light;
			},
			prepare(txt, type, data, light) {
				//txt, type:[scan_id, scan_card, device], data, light:[error, scan_id, on, ok, loading]
				return {
					payload: { id: nanoid(), txt, type, data, light }
				}
			}
		},
	}
});

export const { toggleDevice, setDeviceId, setToInitial, setStatus, fullResetDevice, setDeviceName } = deviceSlice.actions; 
export default deviceSlice.reducer;