import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const roles = {
    GUEST: "GUEST" as const,
    HOST: "HOST" as const,
    ADMIN: "ADMIN" as const,
};

export type Role = (typeof roles)[keyof typeof roles];

export type TUser = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: Role;
    isActive: boolean;
    isEmailVerified?: boolean;
    verificationToken?: string;
    verificationTokenExpiry?: string;
    createdAt?: string;
    updatedAt?: string;
    profileImg?: string;
};

type TAuthState = {
    user: null | TUser;
    token: null | string;
    redirectPath: string | null;
    justLoggedIn: boolean;
};

const initialState: TAuthState = {
    user: null,
    token: null,
    redirectPath: null,
    justLoggedIn: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: TUser; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.justLoggedIn = true;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        },
        setRedirectPath: (state, action: PayloadAction<string | null>) => {
            state.redirectPath = action.payload;
        },
        clearJustLoggedIn: (state) => {
            state.justLoggedIn = false;
        },
    },
});

export const { setUser, logOut, setRedirectPath, clearJustLoggedIn } = authSlice.actions;
export default authSlice.reducer;

export const currentToken = (state: RootState) => state.auth.token;
export const currentUser = (state: RootState) => state.auth.user;
export const redirectPath = (state: RootState) => state.auth.redirectPath;
export const justLoggedIn = (state: RootState) => state.auth.justLoggedIn;
