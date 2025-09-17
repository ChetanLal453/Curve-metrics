import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/about/about-thumb-2.png";
import Two from "public/img/shape/about-thumb-shape.png";

const AboutOne = () => {
  return (
    <div className="about__area p-relative pt-120 pb-60">
      <div className="container">
        <div
          className="row align-items-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-xl-6 col-lg-6">
            <div className="about__thumb-wrapper-3 mb-60">
              <div className="about__thumb-3">
                <Image src={One} alt="image not found" />
              </div>
              <div className="about__thumb-shape">
                <Image src={Two} alt="image not found" />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="about__content-wapper mb-60">
              <div className="section__title-wrapper mb-40">
                <div className="section__subtitle-3">
                  <span>ABOUT OUR company</span>
                </div>
                <div className="section__title-3">
                  Your Partner for Software Innovation
                </div>
              </div>
              <p>
                At Curve Metrics, we lead the way in delivering innovative
                software solutions and dynamic digital marketing strategies.
                With our deep expertise in PHP frameworks (Laravel) and
                WordPress, we empower businesses to thrive in the fast-paced
                digital landscape.
                <br />
                In addition to software innovation, our comprehensive digital
                marketing services enhance your online presence.
              </p>
              <Link className="features__btn inline-block mt-4" href="/about">
              KNOW MORE ABOUT US
              <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutOne;
