import { PackageXCourseUpdateCommand } from '@/types/commands/package-command';
import { PackageXCourse } from '@/types/package-x-course';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CoursesState {
  selectedCourses: PackageXCourseUpdateCommand[];
}

const initialState: CoursesState = {
  selectedCourses: [],
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setSelectedCourses(state, action: PayloadAction<PackageXCourseUpdateCommand[]>) {
      state.selectedCourses = action.payload;
    },
    addSelectedCourse(state, action: PayloadAction<PackageXCourseUpdateCommand>) {
      state.selectedCourses.push(action.payload);
    },
    removeSelectedCourse(state, action: PayloadAction<string>) {
      state.selectedCourses = state.selectedCourses.filter(course => course.courseId !== action.payload);
    },
  },
});

export const { setSelectedCourses, addSelectedCourse, removeSelectedCourse } = coursesSlice.actions;

export default coursesSlice.reducer;
