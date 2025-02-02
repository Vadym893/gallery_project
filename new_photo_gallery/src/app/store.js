import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './followersSlice'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})