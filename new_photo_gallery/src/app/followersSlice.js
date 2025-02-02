import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
export const followerCounter = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    users: [],
  },
  reducers: {
    follow: (state, action) => {
      state.value += 1; // Changed comma to semicolon
      state.users.push(action.payload);
    },
    unfollow: (state, action) => {
      if (state.value > 0) { // Optional: Prevent decrementing below zero
        state.value -= 1;
      }
      state.users = state.users.filter(user => user !== action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { follow, unfollow } = followerCounter.actions;

export default followerCounter.reducer;