import React from "react";
import {useCustomer} from "../../../context/CustomerContext";
import {Link} from "react-router";


const UserNavigation: React.FC = () => {
    const { customer , clearCustomer } = useCustomer();

    const handleLogout = () => {
        clearCustomer();
    }

    return (
        <>
            {customer ? (
                <div className="col-auto">
                    <div className="d-lg-none">
                        <button className="btn btn-icon btn-transparent px-0" data-bs-toggle="dropdown"
                                aria-expanded="false">
                            <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                            </svg>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <a href="/en_US/account/dashboard" className="link-reset dropdown-item"
                                   id="mobile-my-account-button">
                                    My account
                                </a>
                            </li>
                            <li>
                                <a href="/en_US/logout" className="link-reset dropdown-item" id="mobile-logout-button">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="d-none d-lg-flex gap-2 align-items-center ps-2">
                        <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                        </svg>
                        <span>
                            Hello {customer.firstName}!
                        </span>

                        <small className="text-black-50 px-1">|</small>
                        <Link to="/account/dashboard" className="link-reset" id="my-account-button">
                            My account
                        </Link>

                        <small className="text-black-50 px-1">|</small>
                        <button className="btn btn-transparent px-0" id="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="col-auto">
                    <div className="d-flex align-items-center">
                        <div className="d-lg-none">
                            <a href="/en_US/login" className="btn btn-icon btn-transparent px-0"
                               aria-label="account button">
                                <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="2"
                                          d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                                </svg>
                            </a>
                        </div>

                        <div className="d-none d-lg-flex align-items-center gap-2 ps-2">
                            <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                                <path fill="none" stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="2"
                                      d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                            </svg>


                            <Link to="/login" className="link-reset" id="login-page-button">
                                Login
                            </Link>


                            <small className="text-black-50 px-1">|</small>
                            <a href="/en_US/register" className="link-reset" id="register-page-button">
                                Register
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default UserNavigation;
