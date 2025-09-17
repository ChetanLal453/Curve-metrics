import React from "react";
import Image from "next/image";
import Link from "next/link";
import One from "public/img/development/development.png";

const SoftwareOne = () => {
  return (
    <div className="development__area pt-120 pb-60">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-11">
            <div className="section__title-wrapper text-center mb-70">
              <div className="section__subtitle-3">
                <span>WE DEVELOP SOFTWARE FOR YOUR INDIVIDUAL NEEDS</span>
              </div>
              <div className="section__title-3">
                We develop your business from an internal and external customer
                perspective
              </div>
            </div>
          </div>
        </div>
        <div
          className="row align-items-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-xl-6 col-lg-6">
            <div className="development__thumb w-img mb-60">
              <Image src={One} alt="image not found" />
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="development__content-wrapper mb-60">
              <p>
                Get the heavy metal debit card that saves and invests for you
                every time you spend, with Real-Time Roun Ups.
              </p>
              <div className="development__features-wrap">
                <div className="development__features-item">
                  <div className="development__features-icon">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="development__features-text">
                    Lorem ipsum dummy text used here so replace.
                  </div>
                </div>
                <div className="development__features-item">
                  <div className="development__features-icon">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="development__features-text">
                    Lorem ipsum dummy text used here so replace.
                  </div>
                </div>
              </div>
              <div className="development__btn">
                <Link href="/">START 7 DAYS FREE TRAIL</Link>
              </div>
              <div className="development__bottom-text">
                <p>
                  Get the heavy metal debit card that saves and invests lorem
                  you every time. We rank among the best in Argentina dumm Get
                  the heavy metal debit card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwareOne;
