import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/index-4/video.png";
import Two from "public/img/index-4/play.png";
import Three from "public/img/index-4/arrow-color.png";
import Four from "public/img/index-4/video-2.png";

import YoutubeEmbed from "../youtube/YoutubeEmbed";

const HomeFourVideo = () => {
  const [videoActive, setVideoActive] = useState(false);

  return (
    <div className="video-section section-gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div
              className="left position-relative "
              data-aos="fade-right"
              data-aos-delay="0"
            >
              <Image className="img-fluid" src={One} alt="Image" />
              <button
                className="circle-btn"
                aria-label="open video modal"
                onClick={() => setVideoActive(true)}
              >
                <Image className="img-fluid" src={Two} alt="Image" />
              </button>
            </div>
          </div>

          <div className="col-lg-7 " data-aos="fade-left" data-aos-delay="300">
            <h2 className="mb-4 mb-md-5">
              We are more than <br /> digital agency
            </h2>
            <p className="mb-3">
              This is the main factor that sets us apart from our competition
              and allows us deliver a specialist business consultancy service.
              Our team applies its ranging experience to determining the
              strategies.
            </p>
            <div className="video-list d-flex justify-content-between">
              <div className="d-flex flex-column mt-4">
                <div className="d-flex align-items-center gap-8 mb-30">
                  <Image src={Three} alt="Image" />
                  <div className="fs-16">
                    Creating a great digital experience
                  </div>
                </div>
                <div className="d-flex align-items-center gap-8 mb-30">
                  <Image src={Three} alt="Image" />
                  <div className="fs-16">
                    A different way of thinking, both inside
                  </div>
                </div>
                <Link
                  href="/about"
                  className="ms-auto bg-warning text-dark border-btn border border-dark start-btn borderc-btn"
                >
                  get started
                </Link>
              </div>
              <div className="video-sec-sub-thumb">
                <Image className="img-fluid" src={Four} alt="Image" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={(videoActive ? " video-zoom-in" : " ") + " video-backdrop"}
        onClick={() => setVideoActive(false)}
      >
        <div className="video-inner">
          <div
            className="video-container"
            onClick={(e: any) => e.stopPropagation()}
          >
            {videoActive && <YoutubeEmbed embedId="fSv6UgCkuTU" />}
            <button
              aria-label="close video popup"
              className="close-video-popup"
              onClick={() => setVideoActive(false)}
            >
              <i className="fa-light fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeFourVideo;
