import React, { useEffect, useRef, useState } from "react";
import Default from "../../layouts/Default.tsx";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useFlashMessages } from "../../context/FlashMessagesContext.tsx";
import { useCustomer } from "../../context/CustomerContext.tsx";
import { verifyToken } from "../../services/customerVerification.ts";

const VerificationPage: React.FC = () => {
    const { addMessage } = useFlashMessages();
    const { refetchCustomer } = useCustomer();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
    const [statusMessage, setStatusMessage] = useState<string>("");
    const verificationAttempted = useRef(false);

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");

        if (verificationAttempted.current || !tokenFromUrl) {
            if (!tokenFromUrl) {
                setVerificationStatus("error");
                setStatusMessage("No verification token found in the URL. Please ensure you clicked the correct link.");
            }
            return;
        }

        verificationAttempted.current = true;

        const verify = async () => {
            setVerificationStatus("pending");
            setStatusMessage("Verifying your email address...");

            const jwtToken = localStorage.getItem("jwtToken");
            const { success, message } = await verifyToken(tokenFromUrl, jwtToken || '');

            if (success) {
                setVerificationStatus("success");
                setStatusMessage(message || "Your email has been successfully verified!");
                addMessage("success", "Email verified. You can now log in or continue using your account.");
                await refetchCustomer();
            } else {
                setVerificationStatus("error");
                setStatusMessage(message || "Email verification failed. The link might be expired or invalid.");
                addMessage("error", message || "Email verification failed.");
            }
        };

        verify();
    }, [searchParams, addMessage, refetchCustomer, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const renderContent = () => {
        switch (verificationStatus) {
            case "pending":
                return (
                    <>
                        <h1 className="h2 mb-3">Verifying your email...</h1>
                        <p className="lead mb-4">Please wait while we confirm your email address.</p>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </>
                );
            case "success":
                return (
                    <>
                        <h1 className="h2 mb-3">Email Verified!</h1>
                        <p className="lead mb-4">{statusMessage}</p>
                        <p className="mb-5">
                            Your account is now active.
                        </p>
                        <Link to="/login" className="btn btn-primary">
                            Go to Login
                        </Link>
                    </>
                );
            case "error":
                return (
                    <>
                        <h1 className="h2 mb-3">Verification Failed</h1>
                        <p className="lead mb-4">{statusMessage}</p>
                        <p className="mb-5">
                            Please ensure you clicked the correct link. The link may have expired or been used.
                            If you have an account, you can try
                            <Link to="/login" className="link-reset ms-1">logging in</Link> and requesting a new verification email from your dashboard.
                            If you just registered and this is your first attempt, please check your inbox for the most recent link.
                        </p>
                        <Link to="/login" className="btn btn-primary">
                            Go to Login
                        </Link>
                    </>
                );
        }
    };

    return (
        <Default>
            <div className="container my-auto">
                <div className="row justify-content-center my-5">
                    <div className="col-12 col-md-8 col-lg-6 text-center">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </Default>
    );
};

export default VerificationPage;
