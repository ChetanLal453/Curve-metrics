import React from "react";
import Image from "next/image";

import One from "public/img/shape/hero-shape-3.png";
import Two from "public/img/shape/hero-shape-4.png";
import Three from "public/img/hero/hero-thumb-1.png";
import Four from "public/img/shape/dot.png";

const HomeThreeBanner = () => {
  return (
    <section className="hero__area hero__hight d-flex align-items-center p-relative">
      <div className="hero__shape-3">
        <Image src={One} alt="image not found" />
      </div>
      <div className="hero__shape-4">
        <Image src={Two} alt="image not found" />
      </div>
      <div className="container-fluid">
        <div className="hero__main-wrapper">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="hero__content-wrapper">
                <div className="hero__content mb-60">
                  <span className="" data-aos="fade-up" data-aos-delay="200">
                    Welcome to Seofest <span>SEO</span> agency
                  </span>
                  <h2 className="" data-aos="fade-up" data-aos-delay="500">
                    Pioneering search engine optimization.
                  </h2>
                  <p className="" data-aos="fade-up" data-aos-delay="600">
                    Gain and maintain your place at the top of SERPs with our
                    expertise on all leading SEO platforms and licensing to
                    top-tier tools.
                  </p>
                </div>
                <div className="hero__search">
                  <form action="#">
                    <div
                      className="hero__search-input "
                      data-aos="fade-up"
                      data-aos-delay="1200"
                    >
                      <input
                        type="text"
                        placeholder="Enter Your Website Link"
                      />
                      <button type="submit">
                        Check Now<i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="hero__thumb-wrapper mb-60">
                <div className="hero__thumb w-img">
                  <Image src={Three} alt="image not found" />
                </div>
                <div className="hero__shape-1">
                  <Image
                    className="parallaxed"
                    src={Four}
                    alt="image not found"
                  />
                </div>
                <div className="hero__shape-2">
                  <Image
                    className="parallaxed"
                    src={Four}
                    alt="image not found"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeThreeBanner;
