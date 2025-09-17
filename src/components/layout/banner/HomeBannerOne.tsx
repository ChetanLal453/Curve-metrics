import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/shape/hero-shape-9.png";
import Two from "public/img/shape/hero-shape-10.png";
import Three from "public/img/shape/hero-shape-11.png";
import Four from "public/img/hero/hero-thumb-3.webp";

const HomeBannerOne = () => {
  return (
    <section className="hero__area-3 hero__hight-3 d-flex align-items-center p-relative">
      <div className="hero__shape-9">
        <Image src={One} alt="Image" />
      </div>
      <div className="hero__shape-10">
        <Image src={Two} alt="Image" />
      </div>
      <div className="hero__shape-11">
        <Image src={Three} alt="Image" />
      </div>
      <div className="hero__wrapper mt-30 m-auto">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-7 col-lg-6">
              <div className="hero__content-wrapper-3">
                <div className="hero__filter">
                  <form action="#">
                    <div
                      className="hero__filter-input "
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <input
                        type="text"
                        placeholder="Enter Your Website Link"
                      />
                      <button type="submit">SUBSCRIBE NOW</button>
                    </div>
                  </form>
                </div>
                <div className="hero__content-3 mb-60">
                  <h2 data-aos="fade-up" data-aos-delay="500">
                    <span style={{ display: "block", fontSize: "20px" }}>
                      Functional, Usability & Performance
                    </span>
                    SOFTWARE DEVELOPMENT
                  </h2>
                  <p data-aos="fade-up" data-aos-delay="700">
                    We transform business of most major sectors with powerful
                    and adaptable digital solutions that satisfy the needs of today.
                  </p>
                </div>
                <div className="hero__reating">
                  <div className="hero__reating-shape">
                    <Image src={Two} alt="Image" />
                  </div>
                  <span>4.8</span>
                  <div className="icon">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <h6>
                    Trusted by 1200+ more
                    <br />
                    companies
                  </h6>
                  <Link className="hero__reating-btn" href="/service">
                    GET STARTED
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6">
              <div className="hero__thumb-wrapper-2 mb-60">
                <div className="hero__thumb-3 w-img">
                  <Image src={Four} alt="image not found" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBannerOne;
