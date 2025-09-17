import React from "react";
import Image from "next/image";

import One from "public/img/recent/icon/01.png";

const TechnicalProject = () => {
  return (
    <section className="recent__area grey-bg pt-120">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-65">
              <span className="section__subtitle">
                <span>You May </span>also like
              </span>
              <h2 className="section__title">Related Services</h2>
            </div>
          </div>
        </div>
        <div className="row  " data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-4">
            <div className="recent__item mb-30">
              <div className="recent__icon">
                <Image src={One} alt="image not found" />
              </div>
              <div className="recent__content">
                <h3>Lead Generation</h3>
                <p>
                  A Comprehensive roadmap to define success, market validation
                  to KPIs.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="recent__item mb-30">
              <div className="recent__icon">
                <Image src={One} alt="image not found" />
              </div>
              <div className="recent__content">
                <h3>Strategic Planning </h3>
                <p>
                  A Comprehensive roadmap to define success, market validation
                  to KPIs.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="recent__item mb-30">
              <div className="recent__icon">
                <Image src={One} alt="image not found" />
              </div>
              <div className="recent__content">
                <h3>Product Consultation</h3>
                <p>
                  A Comprehensive roadmap to define success, market validation
                  to KPIs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalProject;
