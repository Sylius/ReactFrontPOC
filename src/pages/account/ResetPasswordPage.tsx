import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Default from "../../layouts/Default";
import { useFlashMessages } from "../../context/FlashMessagesContext";

const ResetPasswordPage: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [errors, setErrors] = useState<{ newPassword?: string; confirmNewPassword?: string }>({});
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addMessage } = useFlashMessages();

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            addMessage("error", "Invalid or missing token.");
            navigate("/forgotten-password", { replace: true });
        }
    }, [token, navigate, addMessage]);

    const validate = (): boolean => {
        const errs: { newPassword?: string; confirmNewPassword?: string } = {};
        if (newPassword.length < 3) errs.newPassword = "Password must be at least 3 characters.";
        if (newPassword !== confirmNewPassword) errs.confirmNewPassword = "Passwords must match.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/customers/reset-password/${token}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/merge-patch+json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        newPassword,
                        confirmNewPassword,
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Password reset failed.");
            }

            addMessage("success", "Your password has been reset successfully!");
            navigate("/login", { replace: true });
        } catch (err) {
            if (err instanceof Error) {
                addMessage("error", err.message);
            } else {
                addMessage("error", "Unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Default>
            <div className="container my-auto">
                <div className="row justify-content-center my-5">
                    <div className="col-12 col-md-8 col-lg-6">
                        <h1 className="h2 mb-4">Reset your password</h1>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label required">New password</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    className={"form-control" + (errors.newPassword ? " is-invalid" : "")}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                                {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confirmNewPassword" className="form-label required">Repeat new password</label>
                                <input
                                    id="confirmNewPassword"
                                    type="password"
                                    className={"form-control" + (errors.confirmNewPassword ? " is-invalid" : "")}
                                    value={confirmNewPassword}
                                    onChange={e => setConfirmNewPassword(e.target.value)}
                                />
                                {errors.confirmNewPassword && (
                                    <div className="invalid-feedback">{errors.confirmNewPassword}</div>
                                )}
                            </div>

                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Default>
    );
};

export default ResetPasswordPage;
