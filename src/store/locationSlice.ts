import { FormValues } from "@/type/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface locationState {
    locations: FormValues[]
}

const initialState: locationState = {
    locations: []
}

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        addLocations: (state, { payload }: PayloadAction<FormValues>) => {
            state.locations.push(payload)
        },
        editLocation: (state, { payload }: PayloadAction<FormValues>) => {
            const index = state.locations.findIndex(location => location.id === payload.id);
            if(index !== -1) state.locations[index] = payload
        }
    }
})

export const { addLocations, editLocation} = locationSlice.actions;

export default locationSlice.reducer;