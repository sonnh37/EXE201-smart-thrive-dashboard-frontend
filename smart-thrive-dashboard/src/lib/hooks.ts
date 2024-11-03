// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store'; // Đường dẫn tới file store của bạn

// Sử dụng kiểu cụ thể cho useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Sử dụng kiểu cụ thể cho useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
