import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.action';

export interface AuthState {
  token: string | null;
}

export const initialState: AuthState = {
  token: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.setToken, (state, { token }) => ({ ...state, token }))
);
