import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { jwtDecode } from "jwt-decode";

export const roles = {
    ADMIN: "admin" as const,
    MANAGER: "manager" as const,
};

export type Role = (typeof roles)[keyof typeof roles];

export type TUser = {
    _id: string;
    name: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
};

type TAuthState = {
    user: null | TUser;
    token: null | string;
};

const initialState: TAuthState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ token: string }>) => {
            const { token } = action.payload;
            state.token = token;
            try {
                state.user = jwtDecode(token) as TUser;
            } catch (error) {
                console.error("Token decoding failed:", error);
                state.user = null;
            }
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;

export const currentToken = (state: RootState) => state.auth.token;
export const currentUser = (state: RootState) => state.auth.user;
