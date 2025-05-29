const getApiUrl = (): string => {
    if (typeof window !== "undefined" && window.ENV?.API_URL) {
        return window.ENV.API_URL;
    }
    throw new Error("API_URL is not defined in window.ENV");
};

export const sendVerificationEmail = async (
    email: string,
    jwtToken: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        const API_URL = getApiUrl();
        const verificationFrontendUrl = "/verify";

        const response = await fetch(`${API_URL}/api/v2/shop/customers/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ email, link: verificationFrontendUrl }),
        });

        const text = await response.text();
        let data: any = {};
        try {
            data = text ? JSON.parse(text) : {};
        } catch {}

        if (response.ok) {
            return {
                success: true,
                message: "Verification email sent. Please check your inbox.",
            };
        } else {
            if (data.message === "Email already verified") {
                return {
                    success: false,
                    message: "Your email is already verified.",
                };
            }
            return {
                success: false,
                message: data.message || data.detail || "Failed to send verification email.",
            };
        }
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        };
    }
};

export const verifyToken = async (
    token: string,
    jwtToken?: string
): Promise<{ success: boolean; message?: string }> => {
    try {
        const API_URL = getApiUrl();
        const headers: HeadersInit = {
            "Content-Type": "application/merge-patch+json",
        };
        if (jwtToken) {
            headers.Authorization = `Bearer ${jwtToken}`;
        }

        const response = await fetch(
            `${API_URL}/api/v2/shop/customers/verify/${token}`,
            {
                method: "PATCH",
                headers,
                body: JSON.stringify({}),
            }
        );

        const text = await response.text();
        let data: any = {};
        try {
            data = text ? JSON.parse(text) : {};
        } catch {}

        if (response.ok) {
            return {
                success: true,
                message: data.message || "Your email has been successfully verified!",
            };
        } else {
            const msg =
                data.message ||
                data.detail ||
                "Verification failed. The link may be invalid or expired.";
            return { success: false, message: msg };
        }
    } catch (error) {
        console.error("Error during token verification:", error);
        return {
            success: false,
            message: "Unexpected error during verification. Please try again.",
        };
    }
};
