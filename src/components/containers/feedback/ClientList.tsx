import React from "react";
import Image from "next/image";

import One from "public/img/index-4/list1.png";
import Two from "public/img/index-4/list2.png";
import Three from "public/img/index-4/list3.png";
import Four from "public/img/index-4/list4.png";
import Five from "public/img/index-4/list5.png";
import Six from "public/img/index-4/list6.png";

const ClientList = () => {
  return (
    <div className="client-list-section section-gap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              className="d-flex align-items-center justify-content-center flex-wrap gap-3 "
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="item d-flex align-items-center justify-content-center">
                <Image className="img-fluid" src={One} alt="Image" />
              </div>
              <div className="item d-flex align-items-center justify-content-center">
                <Image className="img-fluid" src={Two} alt="Image" />
              </div>
              <div className="item d-flex align-items-center justify-content-center">
                <Image className="img-fluid" src={Three} alt="Image" />
              </div>
              <div className="item d-flex align-items-center justify-content-center">
                <Image className="img-fluid" src={Four} alt="Image" />
              </div>
              <div className="item d-flex align-items-center justify-content-center">
                <Image className="img-fluid" src={Five} alt="Image" />
              </div>
              <div className="item d-flex align-items-center justify-content-center">
                <Image className="img-fluid" src={Six} alt="Image" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
