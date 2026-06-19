import { store } from '@/store/redux';
import { ReduxActionType } from '@/enums/redux';

export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;

  // 1. Clear all browser storage (localStorage & sessionStorage)
  localStorage.clear();
  sessionStorage.clear();

  // 2. Reset entire Redux store (works for all current and future slices!)
  store.dispatch({ type: ReduxActionType.RESET_STORE });
};
