import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/index-4/arrow.svg";
import Two from "public/img/index-4/offer-arrow.png";
import Three from "public/img/index-4/light.png";

const HomeFourOffer = () => {
  return (
    <div>
      <div className="offer-section section-gap">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="offer-top-title d-flex flex-wrap align-items-center justify-content-between mb-5 pb-md-5">
                <h2 className="" data-aos="fade-right" data-aos-delay="0">
                  what we offer
                </h2>
                <p>
                  The awesome people who makes <br />
                  all this possible
                </p>
                <div
                  className="d-flex gap-3 align-items-center "
                  data-aos="fade-left"
                  data-aos-delay="300"
                >
                  <div className="text-dark">View All services</div>
                  <Link href="/" className="circle-btn">
                    <Image src={One} alt="Image" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div
                className="offer-categories d-flex flex-wrap justify-content-center "
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div>
                  TECH <sup>01</sup>
                  <Image src={Two} alt="Image" />
                </div>
                <div>
                  Science <sup>02</sup>
                  <Image src={Two} alt="Image" />
                </div>
                <div>
                  Social <sup>03</sup>
                  <Image src={Two} alt="Image" />
                </div>
                <div>
                  Deals <sup>04</sup>
                  <Image src={Two} alt="Image" />
                </div>
                <div>
                  Entertainment <sup>05</sup>
                  <Image src={Two} alt="Image" />
                </div>
                <div>
                  Medical <sup>06</sup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image className="position-absolute left" src={Three} alt="Image" />
    </div>
  );
};

export default HomeFourOffer;
