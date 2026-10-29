import { useDispatch, useSelector } from 'react-redux';

// Thin wrappers so the whole app imports hooks from one place.
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
