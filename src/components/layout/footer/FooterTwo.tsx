import React from "react";
import Image from "next/image";
import Link from "next/link";

import Logo from "public/img/logo/logo.png";
import Shape from "public/img/shape/footer-shape.png";

const FooterTwo = () => {
  return (
    <footer>
      <section className="footer__border footer-bg grey__bg p-relative z-index-11 pt-120 pb-60">
        <div className="footer__shape">
          <Image src={Shape} alt="Image" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xl-2 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget footer__col-1 mb-55">
                <div className="footer__title">
                  <h3>COMPANY</h3>
                </div>
                <div className="footer__link">
                  <ul>
                    <li>
                      <Link href="/">About</Link>
                    </li>
                    <li>
                      <Link href="/">Blog</Link>
                    </li>
                    <li>
                      <Link href="/">Resources</Link>
                    </li>
                    <li>
                      <Link href="/">Free SEO Tools</Link>
                    </li>
                    <li>
                      <Link href="/">Contact Us</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget footer__col-2 mb-55">
                <div className="footer__title">
                  <h3>Services</h3>
                </div>
                <div className="footer__link">
                  <ul>
                    <li>
                      <Link href="/">Search Engine Optimization</Link>
                    </li>
                    <li>
                      <Link href="/">PPC Management Services</Link>
                    </li>
                    <li>
                      <Link href="/">Social Media Management</Link>
                    </li>
                    <li>
                      <Link href="/">Link Building Services</Link>
                    </li>
                    <li>
                      <Link href="/">Conversion Optimization</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget footer__col-3 mb-55">
                <div className="footer__title">
                  <h3>Explore Seofest</h3>
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
                      <Link href="/">Affilitate Program</Link>
                    </li>
                    <li>
                      <Link href="/">Product Design</Link>
                    </li>
                    <li>
                      <Link href="/"> Web Design Services</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget mb-55">
                <div className="footer__logo mb-20">
                  <Link href="/">
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
          </div>
        </div>
      </section>
      <div className="footer__copyright grey-bg-2">
        <div className="container">
          <div className="copyright__inner-2">
            <div className="copyright__text text-center">
              <p>Copyright © 2023 Digitek All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterTwo;
