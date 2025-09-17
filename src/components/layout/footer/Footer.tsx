import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "public/img/logo/logo.png";

const Footer = () => {
  return (
    <footer>
      <section className="footer__border p-relative z-index-11 pt-120 pb-55 foot-one-bg">
        <div className="footer__style-3">
          <span className="footer__cercle"></span>
          <div className="container">
            <div className="footer__inner mb-50">
              <div className="row">
                <div className="col-xl-5 col-lg-4 col-md-5 col-sm-6">
                  <div className="footer__widget mb-55">
                    <div className="footer__logo mb-20">
                      <Link href="index.html">
                        <Image src={Logo} alt="logo not found" />
                      </Link>
                    </div>
                    <div className="footer__contact mb-30">
                      <span>Boise, Idaho Office</span>
                      <span>1150 W. State Street, Suite 240,</span>
                      <span>Boise, Idaho 83702 USA</span>
                    </div>
                    <div className="touch__social">
                      <Link href="/">
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                      <Link href="/">
                        <i className="fa-brands fa-twitter"></i>
                      </Link>
                      <Link href="/">
                        <i className="fa-brands fa-youtube"></i>
                      </Link>
                      <Link href="/">
                        <i className="fa-brands fa-linkedin"></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                  <div className="footer__widget footer__col-1 mb-55">
                    <div className="footer__title">
                      <h3>About us</h3>
                    </div>
                    <div className="footer__link">
                      <ul>
                        <li>
                          <Link href="/">About Us</Link>
                        </li>
                        <li>
                          <Link href="/">Community Blog</Link>
                        </li>
                        <li>
                          <Link href="/">Rewards</Link>
                        </li>
                        <li>
                          <Link href="/">Work with Us</Link>
                        </li>
                        <li>
                          <Link href="/">Contact Us</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6">
                  <div className="footer__widget footer__col-5 mb-55">
                    <div className="footer__title">
                      <h3>Explore Softim</h3>
                    </div>
                    <div className="footer__link">
                      <ul>
                        <li>
                          <Link href="/">Account</Link>
                        </li>
                        <li>
                          <Link href="/">Privacy Policy</Link>
                        </li>
                        <li>
                          <Link href="/">Affilitate </Link>
                        </li>
                        <li>
                          <Link href="/">Program</Link>
                        </li>
                        <li>
                          <Link href="/">Our Partner</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-6 col-sm-6">
                  <div className="footer__widget footer__col-6 mb-55">
                    <div className="footer__title">
                      <h3>Quick lInks</h3>
                    </div>
                    <div className="footer__link">
                      <ul>
                        <li>
                          <Link href="/">About us</Link>
                        </li>
                        <li>
                          <Link href="/">News & press</Link>
                        </li>
                        <li>
                          <Link href="/">Blog</Link>
                        </li>
                        <li>
                          <Link href="/">FAQs</Link>
                        </li>
                        <li>
                          <Link href="/">Careers</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="footer__copyright">
                  <div className="copyright__text text-center">
                    <p>Copyright © 2023 Digitek All Rights Reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
