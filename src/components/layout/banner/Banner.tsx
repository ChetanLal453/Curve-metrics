import React from "react";
import Link from "next/link";
import Image from "next/image";

import One from "public/img/shape/breadcrum-1.png.png";

const Banner = ({ title }: any) => {
  return (
    <div className="breadcrumb__area">
      <Image
        className="breadcrumb__shape-2"
        src={One}
        alt="image not found"
        priority
      />
      <Image
        className="breadcrumb__shape-1"
        src={One}
        alt="image not found"
        priority
      />
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="breadcrumb__wrapper text-center">
              <div className="breadcrumb__title">
                <h2>{title}</h2>
              </div>
              <div className="breadcrumb__menu">
                <nav
                  aria-label="Breadcrumbs"
                  className="breadcrumb-trail breadcrumbs"
                >
                  <ul className="trail-items">
                    <li className="trail-item trail-begin">
                      <span>
                        <Link href="/">Home</Link>
                      </span>
                    </li>
                    <li className="trail-item trail-end">
                      <span>{title}</span>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
