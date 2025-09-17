import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/approach/roket-thumb.png";
import Two from "public/img/svg/arrow-2.svg";
import Three from "public/img/shape/approach-pattern.png";

const HomeThreeApproach = () => {
  return (
    <div className="approach__area grey-bg p-relative z-index-11 pt-120 pb-60">
      <div className="approach__shape">
        <Image src={Three} alt="image not found" />
      </div>
      <div className="container">
        <div
          className="row align-items-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-xl-6 col-lg-6">
            <div className="approach__thumb-wrapper mb-60 p-relative">
              <div className="approach__thumb w-img ">
                <Image src={One} alt="image not found" />
                <span className="approach__cercle"></span>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="approach__content-wrapper mb-60">
              <div className="section__title-wrapper">
                <span className="section__subtitle">
                  <span>OUR</span>APPROACH
                </span>
                <h2 className="section__title mb-30">
                  Website <span className="down__mark-line">redesign</span> &
                  relaunch
                </h2>
                <p>
                  We use the latest SEO and digital marketing best practices to
                  boost your brand. Our team supports yours, as much as is
                  needed, throughout the entire process.
                </p>
              </div>
              <div className="approach__features">
                <div className="approach__features-item">
                  <div className="approach__arrow">
                    <Image src={Two} alt="img not found" />
                  </div>
                  <div className="approach__text">
                    <span>Optimized SEO</span>
                  </div>
                </div>
                <div className="approach__features-item">
                  <div className="approach__arrow">
                    <Image src={Two} alt="img not found" />
                  </div>
                  <div className="approach__text">
                    <span>Optimized SEO</span>
                  </div>
                </div>
                <div className="approach__features-item">
                  <div className="approach__arrow">
                    <Image src={Two} alt="img not found" />
                  </div>
                  <div className="approach__text">
                    <span>Optimized SEO</span>
                  </div>
                </div>
                <div className="approach__features-item">
                  <div className="approach__arrow">
                    <Image src={Two} alt="img not found" />
                  </div>
                  <div className="approach__text">
                    <span>Optimized SEO</span>
                  </div>
                </div>
                <div className="approach__features-item">
                  <div className="approach__arrow">
                    <Image src={Two} alt="img not found" />
                  </div>
                  <div className="approach__text">
                    <span>Optimized SEO</span>
                  </div>
                </div>
                <div className="approach__features-item">
                  <div className="approach__arrow">
                    <Image src={Two} alt="img not found" />
                  </div>
                  <div className="approach__text">
                    <span>Optimized SEO</span>
                  </div>
                </div>
              </div>
              <p>
                We use the latest SEO and digital marketing best practices to
                boost your brand. Our team supports yours, as much as is needed,
                throughout the entire process.
              </p>
              <div className="approac__btn-wrapper">
                <Link className="border__btn s-2" href="about">
                  Read More
                </Link>
                <Link className="border__btn" href="about">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeThreeApproach;
