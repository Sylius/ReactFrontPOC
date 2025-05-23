// src/services/customerVerification.ts
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const sendVerificationEmail = async (
    email: string,
    jwtToken: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        const verificationFrontendUrl = `${import.meta.env.VITE_REACT_APP_FRONTEND_URL}/verify`;

        const response = await fetch(`${API_URL}/api/v2/shop/customers/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ email, link: verificationFrontendUrl }),
        });

        if (response.ok) {
            return { success: true, message: "Verification email sent. Please check your inbox." };
        } else {
            const errorData = await response.json();
            if (errorData.message === "Email already verified") {
                return { success: false, message: "Your email is already verified." };
            }
            return {
                success: false,
                message: errorData.message || errorData.detail || "Failed to send verification email.",
            };
        }
    } catch {
        return { success: false, message: "An unexpected error occurred. Please try again." };
    }
};

export const verifyToken = async (
    token: string,
    jwtToken?: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/merge-patch+json",
        };
        if (jwtToken) {
            headers.Authorization = `Bearer ${jwtToken}`;
        }

        const response = await fetch(`${API_URL}/api/v2/shop/customers/verify/${token}`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify({}),
        });

        if (response.ok) {
            return { success: true, message: "Your email has been successfully verified!" };
        } else {
            const errorData = await response.json();
            if (errorData.message === "Verification token is invalid or expired.") {
                return { success: false, message: "The verification link is invalid or has expired. Please request a new one." };
            }
            return {
                success: false,
                message: errorData.message || errorData.detail || "Email verification failed.",
            };
        }
    } catch (error) {
        console.error("Error during token verification:", error);
        return {
            success: false,
            message: "An unexpected error occurred during verification. Please try again.",
        };
    }
};
