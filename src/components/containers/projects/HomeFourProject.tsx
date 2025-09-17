import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/index-4/product-1.png";
import Two from "public/img/index-4/arrow.svg";
import Three from "public/img/index-4/product-2.png";
import Four from "public/img/index-4/product-3.png";
import Five from "public/img/index-4/product-4.png";
import Six from "public/img/index-4/left-1.png";
import Seven from "public/img/index-4/right-1.png";

const HomeFourProject = () => {
  return (
    <div className="project-section section-gap">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div
              className="d-flex flex-wrap justify-content-center align-items-center gap-3  mb-30 "
              data-aos="fade-up"
              data-aos-delay="900"
            >
              <h2>branding</h2>
              <i className="fas fa-star-of-life"></i>
              <h2>packaging</h2>
              <i className="fas fa-star-of-life"></i>
              <h2>digital</h2>
              <i className="fas fa-star-of-life"></i>
              <h2>web</h2>
              <i className="fas fa-star-of-life"></i>
              <h2>mobile</h2>
            </div>
            <p
              className="mb-4 mb-md-5 text-center "
              data-aos="fade-up"
              data-aos-delay="1200"
            >
              The awesome people who makes all this possible
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="project-list d-flex flex-wrap">
              <div className="w-50 " data-aos="fade-right" data-aos-delay="0">
                <div className=" position-relative overflow-hidden">
                  <Image className="w-100" src={One} alt="Image" />
                  <h6 className="align-items-center d-flex">
                    Branding Identity for Haus
                    <Link
                      href="/"
                      className="d-inline-block bg-warning ms-auto p-2 border-btn"
                    >
                      <Image src={Two} alt="Image" />
                    </Link>
                  </h6>
                </div>
              </div>
              <div className="w-50 " data-aos="fade-left" data-aos-delay="300">
                <div className=" position-relative overflow-hidden">
                  <Image className="w-100" src={Three} alt="Image" />
                  <h6 className="align-items-center d-flex">
                    Branding Identity for Haus
                    <Link
                      href="/"
                      className="d-inline-block bg-warning ms-auto p-2 border-btn"
                    >
                      <Image src={Two} alt="Image" />
                    </Link>
                  </h6>
                </div>
              </div>
              <div className="w-50 " data-aos="fade-right" data-aos-delay="0">
                <div className=" position-relative overflow-hidden">
                  <Image className="w-100" src={Four} alt="Image" />
                  <h6 className="align-items-center d-flex">
                    Branding Identity for Haus
                    <Link
                      href="/"
                      className="d-inline-block bg-warning ms-auto p-2 border-btn"
                    >
                      <Image src={Two} alt="Image" />
                    </Link>
                  </h6>
                </div>
              </div>
              <div className="w-50 " data-aos="fade-left" data-aos-delay="300">
                <div className=" position-relative overflow-hidden">
                  <Image className="w-100" src={Five} alt="Image" />
                  <h6 className="align-items-center d-flex">
                    Branding Identity for Haus
                    <Link
                      href="/"
                      className="d-inline-block bg-warning ms-auto p-2 border-btn"
                    >
                      <Image src={Two} alt="Image" />
                    </Link>
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <Link
              href="/project"
              className="d-inline-block border-btn bg-warning px-4 py-3 text-dark mt-4 mt-md-5 fs-16 border border-dark borderc-btn"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </div>
      <div className="project-thumbs">
        <Image className="position-absolute left" src={Six} alt="Image" />
        <Image className="position-absolute right" src={Seven} alt="Image" />
      </div>
    </div>
  );
};

export default HomeFourProject;
