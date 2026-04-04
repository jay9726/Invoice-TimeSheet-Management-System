import type { LoginResponse } from "../apis/types";

const KEY = 'auth_session';

export const SessionAuthentication = {
    setSession(data: LoginResponse) {
        sessionStorage.setItem(KEY, JSON.stringify(data))
    },


    getSession(): LoginResponse | null {
        const raw = sessionStorage.getItem(KEY);
        if (!raw) return null;

        try {
            return JSON.parse(raw) as LoginResponse;
        } catch (error) {
            return null
        }
    },

    clearSession() {
        sessionStorage.removeItem(KEY);
    }
}


