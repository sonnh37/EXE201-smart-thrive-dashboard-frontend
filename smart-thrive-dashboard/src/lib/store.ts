// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './slices/coursesSlice'; // Đường dẫn tới slice của bạn

const store = configureStore({
  reducer: {
    courses: coursesReducer,
  },
});

// Định nghĩa RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;