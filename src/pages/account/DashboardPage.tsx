import React, { useEffect, useState, useRef } from "react";
import Default from "../../layouts/Default";
import AccountLayout from "../../layouts/Account";
import { useCustomer } from "../../context/CustomerContext";
import { useFlashMessages } from "../../context/FlashMessagesContext";
import { IconPencil, IconLock, IconCheck } from "@tabler/icons-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
    const { customer, refetchCustomer } = useCustomer();
    const { addMessage } = useFlashMessages();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isVerifying, setIsVerifying] = useState(false);

    const verificationAttempted = useRef(false);

    const handleVerifyClick = async () => {
        if (!customer?.email) {
            addMessage("error", "Customer email not found.");
            return;
        }

        const jwtToken = localStorage.getItem("jwtToken");
        if (!jwtToken) {
            addMessage("error", "Authentication token not found. Please log in again.");
            return;
        }

        setIsVerifying(true);

        try {
            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

            const dataToSend = {
                email: customer.email,
                link: "http://localhost:5173/account/dashboard",
            };

            const response = await fetch(`${apiUrl}/api/v2/shop/customers/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                addMessage("success", "Verification email sent! Please check your inbox.");
            } else {
                const errorData = await response.json();
                addMessage("error", errorData.message || errorData.detail || "Failed to send verification email.");
            }
        } catch {
            addMessage("error", "An unexpected error occurred. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        const jwtToken = localStorage.getItem("jwtToken");

        if (!tokenFromUrl || !jwtToken) {
            return;
        }

        if (verificationAttempted.current) {
            return;
        }

        verificationAttempted.current = true;

        const verify = async () => {
            try {
                const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
                const response = await fetch(`${apiUrl}/api/v2/shop/customers/verify/${tokenFromUrl}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/merge-patch+json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    body: JSON.stringify({}),
                });

                if (response.ok) {
                    addMessage("success", "Your email has been successfully verified.");
                    await refetchCustomer();
                    navigate("/account/dashboard", { replace: true });
                } else {
                    const errorData = await response.json();
                    console.error("API Error Response for token verification:", errorData);
                    addMessage("error", errorData.message || errorData.detail || "Verification failed.");
                    navigate("/account/dashboard", { replace: true });
                }
            } catch (error) {
                console.error("Unexpected error during token verification:", error);
                addMessage("error", "Unexpected error during token verification. Please try again.");
                navigate("/account/dashboard", { replace: true });
            }
        };

        verify();

    }, [searchParams, addMessage, refetchCustomer, navigate]);

    return (
        <Default>
            <AccountLayout>
                <div className="col-12 col-md-9">
                    <div className="mb-4">
                        <h1>My account</h1>
                        Manage your personal information and preferences
                    </div>

                    <div className="card border-0 bg-body-tertiary">
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-12 col-sm-auto mb-2 order-sm-1">
                                    {customer?.user?.verified ? (
                                        <span className="badge text-bg-success">Verified</span>
                                    ) : (
                                        <span className="badge text-bg-danger">Not verified</span>
                                    )}
                                </div>

                                <div className="col-12 col-sm">
                                    <strong>{customer?.fullName}</strong>
                                    <div>{customer?.email}</div>
                                </div>
                            </div>

                            <div className="d-flex flex-column align-items-center flex-sm-row gap-2">
                                <Link to="/account/profile/edit" className="btn btn-sm btn-icon btn-outline-gray">
                                    <IconPencil stroke={2} size={16} />
                                    Edit
                                </Link>

                                <Link to="/account/change-password" className="btn btn-sm btn-icon btn-outline-gray">
                                    <IconLock stroke={2} size={16} />
                                    Change password
                                </Link>

                                {!customer?.user?.verified && (
                                    <button
                                        className="btn btn-sm btn-icon btn-outline-gray text-primary"
                                        type="button"
                                        onClick={handleVerifyClick}
                                        disabled={isVerifying}
                                    >
                                        {isVerifying ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <IconCheck stroke={2} size={16} />
                                                Verify
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AccountLayout>
        </Default>
    );
};

export default DashboardPage;
