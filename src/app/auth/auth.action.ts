import { createAction, props } from '@ngrx/store';

export const setLoggedIn = createAction(
  '[Auth] Set Logged In',
  props<{ isLoggedIn: boolean }>()
);
export const setUserRole = createAction(
  '[Auth] Set User Role',
  props<{ userRole: string | null }>()
);
export const setToken = createAction(
  '[Auth] Set Token',
  props<{ token: string }>()
);
