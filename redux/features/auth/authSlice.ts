import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

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
    isActive: boolean;
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
        setUser: (state, action: PayloadAction<{ user: TUser; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
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
