import type { LoginResponse } from "@/modules/auth/apis/types";
import { SessionAuthentication } from "@/modules/auth/guards/SessisonAuthentication";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface authState {
  user: LoginResponse | null;
  isAuthenticated: boolean;
}

const session = SessionAuthentication.getSession();

const initialState: authState = {
  user: session ?? null,
  isAuthenticated: !!(session?.token && session?.id),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      SessionAuthentication.setSession({
        token: action.payload.token,
        id: action.payload.id,
        role: action.payload.role
      });
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      SessionAuthentication.clearSession();
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
