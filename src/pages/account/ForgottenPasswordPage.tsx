import React, { useState } from "react";
import Default from "../../layouts/Default.tsx";
import { useNavigate } from "react-router-dom";
import { useFlashMessages } from "../../context/FlashMessagesContext.tsx";
import { IconLockOpen } from "@tabler/icons-react";

const ForgottenPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addMessage } = useFlashMessages();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/customers/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to request password reset.");
            }

            addMessage(
                "success",
                "If the email you have specified exists in our system, we have sent there an instruction on how to reset your password."
            );
            navigate("/login", { replace: true });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
            addMessage("error", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Default>
            <div className="container my-auto">
                <div className="row my-4">
                    <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-0 order-lg-0">
                        <div className="d-flex flex-column justify-content-center align-items-center bg-light rounded-4 h-100 p-3">
                            <div className="text-center">
                                <div className="mb-3">
                                    <IconLockOpen stroke={2} size={144} color={"#e8eaed"} />
                                </div>
                                <h2>Don't have an account?</h2>
                                <a
                                    className="btn btn-link"
                                    id="register-here-button"
                                    href="/register"
                                >
                                    Register here
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 offset-xl-1 order-lg-1">
                        <div className="d-flex justify-content-center align-items-center h-100 px-3">
                            <div className="w-100 py-lg-5 mb-5 my-lg-5">
                                <h1 className="h2 mb-3">Reset password</h1>
                                <p className="mb-4">Set a new password for your account</p>
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label required">
                                            Email <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Default>
    );
};

export default ForgottenPasswordPage;
