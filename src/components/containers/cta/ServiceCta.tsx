import React from "react";
import Image from "next/image";

import one from "public/img/svg/cta.svg";

const ServiceCta = () => {
  return (
    <div className="cta__area">
      <div className="container">
        <div className="cta__main-wrappper">
          <div className="row " data-aos="fade-up" data-aos-delay="300">
            <div className="col-xl-12">
              <div className="cta__content-box text-center">
                <div className="cta__icon">
                  <Image src={one} alt="Image" />
                </div>
                <div className="cta__title mb-60">
                  Subscribe to get information, latest news and other
                  interesting offers
                </div>
                <div className="cta__filter">
                  <div className="cta__search-input">
                    <input type="text" placeholder="Enter Your Website Link" />
                    <button type="submit">
                      Check Now<i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCta;
