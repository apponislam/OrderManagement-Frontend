import { baseApi } from "../../api/baseApi";
import { TUser } from "./authSlice";

type RefreshTokenResponse = {
    data: {
        refreshToken: string;
        accessToken: string;
        user: TUser;
    };
};

type SetUserPasswordResponse = {
    success: boolean;
    message: string;
    data: {
        userId: string;
        email: string;
    };
};

const authApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                body: userInfo,
            }),
        }),
        register: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/register",
                method: "POST",
                body: userInfo,
            }),
        }),
        refreshToken: builder.mutation<RefreshTokenResponse, void>({
            query: () => ({
                url: "/auth/refresh-token",
                method: "POST",
                credentials: "include",
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
                credentials: "include",
            }),
        }),
        // === Forgot password endpoints ===
        requestPasswordResetOtp: builder.mutation<void, { email: string }>({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body,
            }),
        }),
        verifyOtp: builder.mutation<{ success: boolean; message: string; data: { resetToken: string } }, { email: string; otp: string }>({
            query: (body) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body,
            }),
        }),

        resendResetOtp: builder.mutation<void, { email: string }>({
            query: (body) => ({
                url: "/auth/resend-reset-otp",
                method: "POST",
                body,
            }),
        }),
        resetPasswordWithToken: builder.mutation<void, { resetToken: string; newPassword: string }>({
            query: (body) => ({
                url: "/auth/reset-password",
                method: "POST",
                body,
            }),
        }),
        verifyEmail: builder.query({
            query: ({ userId, token }: { userId: string; token: string }) => ({
                url: `/auth/verify-email`,
                method: "GET",
                params: { token, id: userId },
            }),
        }),

        setUserPasswordByAdmin: builder.mutation<SetUserPasswordResponse, { userId: string; newPassword: string }>({
            query: (body) => ({
                url: "/auth/set-user-password",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation, useLogoutMutation, useRequestPasswordResetOtpMutation, useVerifyOtpMutation, useResendResetOtpMutation, useResetPasswordWithTokenMutation, useVerifyEmailQuery, useSetUserPasswordByAdminMutation } = authApi;
