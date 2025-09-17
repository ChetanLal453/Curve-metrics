import React from "react";

import Image from "next/image";

import One from "public/img/partner/partner-1.png";
import Two from "public/img/partner/partner-2.png";

const HomeThreePartner = () => {
  return (
    <div className="partner__area">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="partner__wrapper">
              <div className="partner__thumb">
                <Image src={One} alt="image not found" />
              </div>
              <div className="partner__thumb">
                <Image src={Two} alt="image not found" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeThreePartner;
