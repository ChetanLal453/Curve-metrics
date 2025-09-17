import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/index-4/arrow.svg";
import Logo from "public/img/logo/logo.png";
import Two from "public/img/index-4/footer-left.png";
import Three from "public/img/index-4/footer-right.png";

const FooterFour = () => {
  return (
    <footer>
      <div className="container">
        <div className="row section-gap">
          <div className="col-lg-3 mb-4 mb-lg-0 col-sm-6">
            <h4 className="mb-4">Contact</h4>
            <div className="content">
              <p className="mb-3">hello.info@testmail.com</p>
              <p>+30 28210 72116</p>
            </div>
          </div>
          <div className="col-lg-3 mb-4 mb-lg-0 col-sm-6">
            <h4 className="mb-4">Address</h4>
            <div className="content">
              <p>
                Manou sogian nakidon 1 <br />
                3rd floor, Bld. B <br />
                Chania, Crete
              </p>
            </div>
          </div>
          <div className="col-lg-3 mb-4 mb-lg-0 col-sm-6">
            <h4 className="mb-4">important link</h4>
            <div className="content">
              <Link href="/" className="d-block text-dark mb-3">
                Web Design
              </Link>
              <Link href="/" className="d-block text-dark mb-3">
                Web Development
              </Link>
              <Link href="/" className="d-block text-dark mb-3">
                E-commerce
              </Link>
            </div>
          </div>
          <div className="col-lg-3 mb-4 mb-lg-0 col-sm-6">
            <h4 className="mb-4">Stay connected</h4>
            <div className="align-items-center bg-white border-btn d-flex justify-content-between ps-3 borderc-btn">
              <input
                className="w-100 border-0 bg-transparent py-3 "
                type="text"
                placeholder="Enter mail"
              />
              <Image className="me-2" src={One} alt="Image" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="align-items-center d-flex flex-column flex-md-row gap-4 gap-md-0 justify-content-center justify-content-md-between mb-4 mb-md-5">
              <Link href="index-4.html">
                <Image className="w-100" src={Logo} alt="logo" />
              </Link>
              <p className="copy-write">copyright test 2023 all rights</p>
              <div className="d-flex gap-4">
                <Link href="/" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </Link>
                <Link href="/" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </Link>
                <Link href="/" className="social-icon">
                  <i className="fab fa-youtube"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-thumbs">
        <Image className="position-absolute left" src={Two} alt="Image" />
        <Image className="position-absolute right" src={Three} alt="Image" />
      </div>
    </footer>
  );
};

export default FooterFour;
