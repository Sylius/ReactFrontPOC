import React from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import {Link} from "react-router";

interface AccountLayoutProps {
    children: any;
    breadcrumbs?: object;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({children, breadcrumbs}) => {
    return (
        <div className="container mb-auto">
            <div className="row my-4">
                <div className="col-12">
                    <Breadcrumbs paths={[
                        { label: "Home", url: "/account/dashboard" },
                        { label: "Dashboard", url: "/account/dashboard" }
                    ]} />
                </div>

                <div className="col-12 col-md-3 mb-4 mb-md-0">
                    <div className="mb-3">
                        <div className="h3 mb-4">Your account</div>
                        <div className="d-inline-flex flex-column">
                            <Link className="d-flex align-items-center gap-2 py-1 link-reset"
                               to="/account/dashboard">
                                <svg viewBox="0 0 24 24" className="icon mr-2" aria-hidden="true">
                                    <g fill="none" stroke="currentColor" strokeLinecap="round"
                                       strokeLinejoin="round" strokeWidth="2">
                                        <path
                                            d="M5 12H3l9-9l9 9h-2M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path>
                                    </g>
                                </svg>
                                Dashboard
                            </Link>

                            <a className="d-flex align-items-center gap-2 py-1 link-reset"
                               href="/en_US/account/profile/edit">
                                <svg viewBox="0 0 24 24" className="icon mr-2" aria-hidden="true">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="2"
                                          d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                                </svg>
                                Personal information
                            </a>

                            <a className="d-flex align-items-center gap-2 py-1 link-reset"
                               href="/en_US/account/change-password">
                                <svg viewBox="0 0 24 24" className="icon mr-2" aria-hidden="true">
                                    <g fill="none" stroke="currentColor" strokeLinecap="round"
                                       strokeLinejoin="round" strokeWidth="2">
                                        <path
                                            d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"></path>
                                        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-3-5V7a4 4 0 1 1 8 0v4"></path>
                                    </g>
                                </svg>
                                Change password
                            </a>

                            <a className="d-flex align-items-center gap-2 py-1 link-reset"
                               href="/en_US/account/address-book/">
                                <svg viewBox="0 0 24 24" className="icon mr-2" aria-hidden="true">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="2"
                                          d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13m9-13v13m9-13v13"></path>
                                </svg>
                                Address book
                            </a>

                            <a className="d-flex align-items-center gap-2 py-1 link-reset"
                               href="/en_US/account/orders/">
                                <svg viewBox="0 0 24 24" className="icon mr-2" aria-hidden="true">
                                    <g fill="none" stroke="currentColor" strokeLinecap="round"
                                       strokeLinejoin="round" strokeWidth="2">
                                        <path
                                            d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path>
                                        <path d="M17 17H6V3H4"></path>
                                        <path d="m6 5l14 1l-1 7H6"></path>
                                    </g>
                                </svg>
                                Order history
                            </a>
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}

export default AccountLayout;
