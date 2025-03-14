import React from 'react';
import { Link } from 'react-router';

const Header =  () => {
    return (
        <div className="border-bottom py-4">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col">
                        <Link to="/" className="d-inline-block py-lg-2" style={{ width: '10rem' }}
                           aria-label="sylius logo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 3512 1033"
                                 fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2">
                                <path
                                    d="M1285.88 708.833s61.167 72.209 150.375 72.209c56.083 0 102.792-33.959 102.792-89.209 0-125.708-289.709-106.166-289.709-293.083 0-90.083 79.167-160.583 192-160.583 63.75 0 170.834 28.916 170.834 110.458v49.25h-78.209v-28c0-31.458-45.041-54.375-92.625-54.375-64.541 0-105.333 35.667-105.333 80.667 0 121.5 288.875 94.333 288.875 291.416 0 91.667-71.375 170.834-190.292 170.834-75.872-.246-148.185-32.674-198.833-89.167l50.125-60.417zm474.87 246.375c33.333 0 59.458-23.791 75.625-62l19.542-46.75-147-340.666c-5.917-13.625-13.584-17-27.167-17h-10.208v-70.5h48.416c34.834 0 47.584 9.333 61.167 43.333l97.708 242.083a459.47 459.47 0 0 1 15.292 51.834h1.667c3.624-17.589 8.455-34.908 14.458-51.834l89.208-242.083c12.75-34 28.042-43.333 62.875-43.333h49.292v70.5h-11.083c-13.542 0-21.209 3.375-27.167 17l-169.917 419.666c-26.333 66.25-78.166 101.125-138.458 101.125a142.51 142.51 0 0 1-101.083-42.5l33.958-59.458c0 .833 26.333 30.583 62.875 30.583zm433.21-617.5c0-12.75-6.791-18.708-18.666-18.708h-34.834v-70.625h81.542c38.208 0 54.167 16.125 54.167 54.375v456.208c0 12.75 6.791 18.709 18.708 18.709h34.792v70.5h-81.334c-38.208 0-54.166-16.167-54.166-54.375l-.209-456.084zM2451.17 507.5c0-12.75-6.792-18.708-18.709-18.708h-34.833v-70.5h80.75c38.208 0 54.167 16.125 54.167 54.166v286.5c0 12.75 6.791 18.709 18.708 18.709h34.833v70.5h-80.541c-38.25 0-54.167-16.167-54.167-54.375l-.208-286.292zm1.708-259.125h73.875v85.792h-73.875v-85.792zM2690.62 507.5c0-12.75-6.792-18.708-18.708-18.708h-34.834v-70.5h80.709c39.083 0 55.208 16.125 55.208 52.666v203.875c0 59.5 11.917 107.042 79.875 107.042 88.375 0 140.167-77.292 140.167-162.25V418.292h82.416v340.666c0 12.75 6.792 18.709 18.709 18.709h34.791v70.5h-79.166c-36.5 0-54.375-17-54.375-47.584v-16.125c0-13.625.875-24.625.875-24.625h-1.709c-17.666 42.459-72.875 98.709-157.833 98.709-96.875 0-146.125-50.959-146.125-164.792V507.5zm534.21 220.042s50.959 63.708 130 63.708c39.917 0 74.75-17.875 74.75-55.25 0-77.292-234.458-68.792-234.458-207.25 0-82.417 72.167-120.833 159.708-120.833 51.834 0 141 17.833 141 83.333V532h-73.916v-21.25c0-25.5-38.209-36.542-64.542-36.542-48.417 0-79.875 17.042-79.875 51 0 81.542 234.5 63.709 234.5 207.292 0 76.458-67.958 125.708-158.042 125.708-114.666 0-171.583-75.583-171.583-75.583l42.458-55.083z"
                                    fill="#131718" fillRule="nonzero"></path>
                                <path d="M143.417 605.333l206.625 413.25 381.375.625 92.291-129.916-680.291-283.959z"
                                      fill="#30ba9d" fillRule="nonzero"></path>
                                <path
                                    d="M0 650.708l277.792 381.334 453.625.75 92.291-142.667L0 650.708zm333.083-464.541l135.209 104.875 122.25-234.584L549 29.875 333.083 186.167z"
                                    fillRule="nonzero" fill="#1a9f83"></path>
                                <path
                                    d="M731.417 1032.79L333.083 186.165l85.209-61.667 463.5 675.75-150.375 232.542zM510.667 57.625l259.458 209.583L588.042 0l-77.375 57.625z"
                                    fillRule="nonzero" fill="#30ba9d"></path>
                            </svg>
                        </Link>
                    </div>

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


                                <a href="/en_US/login" className="link-reset" id="login-page-button">
                                    Login
                                </a>


                                <small className="text-black-50 px-1">|</small>
                                <a href="/en_US/register" className="link-reset" id="register-page-button">
                                    Register
                                </a>

                            </div>
                        </div>
                    </div>


                    <div className="col-auto position-relative" data-controller="live"
                         data-live-name-value="sylius_shop:cart:widget"
                         data-live-url-value="/en_US/_components/sylius_shop:cart:widget"
                         data-live-listeners-value="[{&quot;action&quot;:&quot;refreshCart&quot;,&quot;event&quot;:&quot;sylius:shop:cart_changed&quot;},{&quot;action&quot;:&quot;refreshCart&quot;,&quot;event&quot;:&quot;sylius:shop:cart_cleared&quot;}]"
                         id="live-3283976089-0"
                         data-live-props-value="{&quot;cart&quot;:null,&quot;hookableMetadata&quot;:{&quot;renderedBy&quot;:&quot;sylius_shop.base.header.content&quot;,&quot;configuration&quot;:&quot;[]&quot;,&quot;prefixes&quot;:[&quot;sylius_shop.homepage.index.header.content&quot;,&quot;sylius_shop.base.header.content&quot;]},&quot;template&quot;:&quot;@SyliusShop\/shared\/components\/header\/cart.html.twig&quot;,&quot;@attributes&quot;:{&quot;id&quot;:&quot;live-3283976089-0&quot;},&quot;@checksum&quot;:&quot;A\/wFpwghMT1N4zipsyyCK80KlKkntZV2R57jmGDzxAU=&quot;}">
                        <Link to="/cart">
                            <div data-loading="" style={{display: 'none'}}>
                                <div className="sylius-shop-loader">
                                    {/*<img src="/build/shop/images/loader.0488c2fc.gif" alt="Loading" loading="lazy"/>*/}
                                </div>
                            </div>
                            <div>
                                <button className="btn btn-icon btn-transparent px-0 position-relative"
                                        data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart"
                                        aria-label="cart button">
                                    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                                        <g fill="none" stroke="currentColor" strokeLinecap="round"
                                           strokeLinejoin="round"
                                           strokeWidth="2">
                                            <path
                                                d="M6.331 8H17.67a2 2 0 0 1 1.977 2.304l-1.255 8.152A3 3 0 0 1 15.426 21H8.574a3 3 0 0 1-2.965-2.544l-1.255-8.152A2 2 0 0 1 6.331 8"></path>
                                            <path d="M9 11V6a3 3 0 0 1 6 0v5"></path>
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </Link>
                    </div>



                    <div className="col-auto d-lg-none">
                        <button className="navbar-toggler btn btn-icon btn-transparent px-0" type="button"
                                data-bs-toggle="offcanvas" data-bs-target="#navbarNav" aria-controls="navbarNav"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <svg viewBox="0 0 24 24" className="icon icon-md" aria-hidden="true">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
