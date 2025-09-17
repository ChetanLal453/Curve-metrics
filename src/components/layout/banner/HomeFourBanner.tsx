import React from "react";
import Image from "next/image";

import One from "public/img/index-4/hero.png";
import Two from "public/img/index-4/spiral.png";
import Three from "public/img/index-4/sheap.png";
import Four from "public/img/index-4/star.png";

const HomeFourBanner = () => {
  return (
    <div className="hero-section section-gap cus-home-four">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="position-relative">
              <p
                className="fw-bold fw-500 mb-30 "
                data-aos="fade-right"
                data-aos-delay="0"
              >
                <span className="text-success">*</span> welcome to #1 Digital
                agency
              </p>
              <h1 className="" data-aos="fade-right" data-aos-delay="300">
                digital
                <span className="circle-btn">
                  <i className="fas fa-paper-plane"></i>
                </span>
                product
                <br />
                design agency
              </h1>
              <div
                className="hero-box d-flex align-items-center gap-4 gap-md-5 "
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <div className="hero-img">
                  <Image className="w-100" src={One} alt="Image" />
                </div>
                <p>
                  We build engaging user experience for early-stage startups by
                  connecting the dots between users&apos; needs and the
                  client&apos;s business model.
                </p>
              </div>
              <div className="hero-thumbs">
                <Image
                  className="img-fluid position-absolute top mw-120"
                  src={Two}
                  alt="Image"
                />
                <Image
                  className="img-fluid position-absolute bottom mw-120"
                  src={Three}
                  alt="Image"
                />
                <Image
                  className="img-fluid position-absolute left mw-120"
                  src={Four}
                  alt="Image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeFourBanner;
