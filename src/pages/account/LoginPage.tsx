import React, { useState } from "react";
import Default from "../../layouts/Default.tsx";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "../../context/CustomerContext.tsx";
import AuthLeftPanel from "../../components/account/AuthLeftPanel";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refetchCustomer } = useCustomer();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/customers/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
      );

      const data: { token: string; customer: string; message?: string } =
          await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("userUrl", data.customer);

      await refetchCustomer();

      navigate("/account/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <Default>
        <div className="container my-auto">
          <div className="row my-4">
            <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 offset-xl-1 order-lg-1">
              <div className="d-flex justify-content-center align-items-center h-100 px-3">
                <div className="w-100 py-lg-5 mb-5 my-lg-5">
                  <h1 className="h2 mb-5">Login</h1>
                  <form onSubmit={handleLogin} noValidate>
                    {error && (
                        <div className="alert alert-danger">
                          <div className="fw-bold">Error</div>
                          {error}
                        </div>
                    )}

                    <div className="mb-5">
                      <div className="field mb-3 required">
                        <label htmlFor="_username" className="form-label required">
                          Username <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            id="_username"
                            name="_username"
                            required
                            className="form-control"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="field mb-3 required">
                        <label htmlFor="_password" className="form-label required">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                            type="password"
                            id="_password"
                            name="_password"
                            required
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <div className="form-check">
                        <input
                            type="checkbox"
                            id="_remember_me"
                            name="_remember_me"
                            className="form-check-input"
                            value="1"
                        />
                        <label className="form-check-label" htmlFor="_remember_me">
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div className="d-grid mb-2">
                      <button
                          type="submit"
                          className="btn btn-primary"
                          id="login-button"
                          disabled={loading}
                      >
                        Login
                      </button>
                    </div>

                    <input
                        type="hidden"
                        name="_csrf_shop_security_token"
                        value="dummy"
                    />
                  </form>

                  <div className="d-grid">
                    <a className="btn btn-link" href="/forgotten-password">
                      Forgot password?
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <AuthLeftPanel />
          </div>
        </div>
      </Default>
  );
};

export default LoginPage;
