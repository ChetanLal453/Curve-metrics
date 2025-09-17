"use client";

import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";

import Logo from "public/img/logo/logo.png";

const HeaderThree = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleToggleMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const handleSubmenu = (submenu: string) => {
    if (submenu === openSubMenu) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(submenu);
    }
  };

  const isSubMenuOpen = (submenu: string) => {
    return submenu === openSubMenu ? "sub-menu-open" : "";
  };

  const isSubMenuButton = (submenu: string) => {
    return submenu === openSubMenu ? " sm-btn-active" : " ";
  };

  useEffect(() => {
    const handleResizeHeader = (): void => {
      setToggleMenu(false);
      setOpenSubMenu(null);
    };

    window.addEventListener("resize", handleResizeHeader);

    return () => {
      window.removeEventListener("resize", handleResizeHeader);
    };
  }, []);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Fragment>
      <div className="fix">
        <div className={(toggleMenu ? " info-open" : " ") + " offcanvas__info"}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-40 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link href="/">
                    <Image src={Logo} alt="logo not found" priority />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button
                    aria-label="Close"
                    onClick={() => setToggleMenu(false)}
                  >
                    <i className="fal fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="offcanvas__search mb-25">
                <form action="/">
                  <input
                    type="text"
                    placeholder="What are you searching for?"
                    required
                  />
                  <button type="submit">
                    <i className="far fa-search"></i>
                  </button>
                </form>
              </div>
              <div className="mobile-menu fix mb-40 mean-container">
                <div className="mean-bar d-block d-lg-none">
                  <nav className="mean-nav">
                    <ul>
                      {/* Home (no dropdown now) */}
                      <li>
                        <Link href="/">Home</Link>
                      </li>
                      <li>
                        <Link href="/about">About</Link>
                      </li>

                      {/* Services with dropdown */}
                      <li className="has-dropdown">
                        <button
                          className={`nul ${isSubMenuButton("services")}`}
                          onClick={() => handleSubmenu("services")}
                        >
                          Services
                          <span className="mean-expand">
                            <i className="fal fa-plus"></i>
                          </span>
                        </button>
                        <ul className={`sub-menu ${isSubMenuOpen("services")}`}>
                          <li>
                            <Link href="/service">All Services</Link>
                          </li>
                          <li>
                            <Link href="/service/seo">SEO Service</Link>
                          </li>
                          <li>
                            <Link href="/service/digital-marketing">
                              Digital Marketing
                            </Link>
                          </li>
                          <li>
                            <Link href="/service/web-design">Web Design</Link>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <Link href="/project">Portfolio</Link>
                      </li>

                      <li className="has-dropdown">
                        <button
                          className={`${isSubMenuButton("pages")}`}
                          onClick={() => handleSubmenu("pages")}
                        >
                          Pages
                          <span className="mean-expand">
                            <i className="fal fa-plus"></i>
                          </span>
                        </button>
                        <ul className={`sub-menu ${isSubMenuOpen("pages")}`}>
                          
                          <li>
                            <Link href="/technical">Technical</Link>
                          </li>
                          <li>
                            <Link href="/project">Portfolio</Link>
                          </li>
                          <li>
                            <Link href="/analys">Analys</Link>
                          </li>
                          <li>
                            <Link href="/team">Team</Link>
                          </li>
                        </ul>
                      </li>

                      <li className="has-dropdown">
                        <button
                          aria-label="select dropdown"
                          className={`${isSubMenuButton("blog")}`}
                          onClick={() => handleSubmenu("blog")}
                        >
                          Blog
                          <span className="mean-expand">
                            <i className="fal fa-plus"></i>
                          </span>
                        </button>
                        <ul className={`sub-menu ${isSubMenuOpen("blog")}`}>
                          <li>
                            <Link href="/blog">Blog</Link>
                          </li>
                          <li>
                            <Link href="/blog-details">Blog Details</Link>
                          </li>
                        </ul>
                      </li>

                      <li className="mean-last">
                        <Link href="/contact">Contact</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              {/* Contact Info + Social (unchanged) */}
              <div className="offcanvas__contact mt-30 mb-20">
                <h4>Contact Info</h4>
                <ul>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-map-marker-alt"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link
                        target="_blank"
                        href="https://www.google.com/maps"
                      >
                        12/A, Mirnada City Tower, NYC
                      </Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="far fa-phone"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link href="tel:+088889797697">+088889797697</Link>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-envelope"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link href="mailto:support@mail.com">
                        support@mail.com
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="offcanvas__social">
                <ul>
                  <li>
                    <Link href="/">
                      <i className="fab fa-facebook-f"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="/">
                      <i className="fab fa-twitter"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="/">
                      <i className="fab fa-youtube"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="/">
                      <i className="fab fa-linkedin"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay and Desktop Header */}
      <div
        className={(toggleMenu ? " overlay-open" : " ") + " offcanvas__overlay"}
        onClick={() => setToggleMenu(false)}
      ></div>
      <div className="offcanvas__overlay-white"></div>
      <header>
        <div
          id="header-sticky"
          className={
            (scrolled ? " sticky" : " ") + " header__area-3 header__transparent"
          }
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-2 col-6">
                <div className="header__logo">
                  <Link href="/">
                    <Image src={Logo} alt="logo not found" priority />
                  </Link>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                <div className="menu__main-wrapper-3 d-flex justify-content-end">
                  <div className="main-menu main-menu-3 d-none d-lg-block">
                    <nav id="mobile-menu">
                      <ul>
                        {/* Home without dropdown */}
                        <li>
                          <Link href="/">Home</Link>
                        </li>
                        <li>
                          <Link href="/about">About</Link>
                        </li>

                        {/* Services with dropdown */}
                        <li className="has-dropdown">
                          <button aria-label="Select dropdown">Services</button>
                          <ul className="submenu">
                            <li>
                              <Link href="/service">All Services</Link>
                            </li>
                            <li>
                              <Link href="/service/seo">SEO Service</Link>
                            </li>
                            <li>
                              <Link href="/service/digital-marketing">
                                Digital Marketing
                              </Link>
                            </li>
                            <li>
                              <Link href="/service/web-design">Web Design</Link>
                            </li>
                          </ul>
                        </li>

                        <li>
                          <Link href="/project">Portfolio</Link>
                        </li>

                        <li className="has-dropdown">
                          <button aria-label="Select Dropdown">Pages</button>
                          <ul className="submenu">
                            <li>
                              <Link href="/about">About Us</Link>
                            </li>
                            <li>
                              <Link href="/technical">Technical</Link>
                            </li>
                            <li>
                              <Link href="/project">Portfolio</Link>
                            </li>
                            <li>
                              <Link href="/analys">Analys</Link>
                            </li>
                            <li>
                              <Link href="/team">Team</Link>
                            </li>
                          </ul>
                        </li>

                        <li className="has-dropdown">
                          <button aria-label="Select Dropdown">Blog</button>
                          <ul className="submenu">
                            <li>
                              <Link href="/blog">Blog</Link>
                            </li>
                            <li>
                              <Link href="/blog-details">Blog Details</Link>
                            </li>
                          </ul>
                        </li>

                        <li>
                          <Link href="/contact">Contact</Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-6">
                <div className="header__right d-flex align-items-center justify-content-end">
                  <div className="header__btn d-none d-xl-block">
                    <Link className="border__btn s-3" href="/contact">
                      GET STARTED
                    </Link>
                  </div>
                  <div className="header__toggle d-xl-none">
                    <button
                      className="sidebar__active"
                      aria-label="Toggle Sidebar"
                      onClick={handleToggleMenu}
                    >
                      <div className="bar-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default HeaderThree;
