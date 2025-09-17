import React, { useState } from "react";
import Image from "next/image";

import One from "public/img/recent/01.jpg";
import Two from "public/img/recent/02.jpg";

import YoutubeEmbed from "../youtube/YoutubeEmbed";

const HomeProjectTwo = () => {
  const [videoActive, setVideoActive] = useState(false);
  return (
    <div className="recent__area grey-bg pt-120 pb-90">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="recent-content-box mb-65">
              <div className="recent__video text-center mb-60">
                <button
                  className="play__btn popup-video play__effect"
                  aria-label="open video modal"
                  onClick={() => setVideoActive(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="116"
                    height="116"
                    viewBox="0 0 116 116"
                  >
                    <g
                      id="Group_27114"
                      data-name="Group 27114"
                      transform="translate(0.323 0.322)"
                    >
                      <circle
                        id="Ellipse_526"
                        data-name="Ellipse 526"
                        cx="58"
                        cy="58"
                        r="58"
                        transform="translate(-0.323 -0.322)"
                        fill="rgba(56,135,254,0.1)"
                      />
                      <g
                        id="Path_26676"
                        data-name="Path 26676"
                        transform="translate(73.677 41.678) rotate(90)"
                        fill="none"
                      >
                        <path
                          d="M15.745,3.209a2,2,0,0,1,3.509,0L33.381,29.04A2,2,0,0,1,31.627,32H3.373a2,2,0,0,1-1.755-2.96Z"
                          stroke="none"
                        />
                        <path
                          d="M 17.50000190734863 3.168291091918945 C 17.32173156738281 3.168291091918945 16.87939262390137 3.21898078918457 16.62263107299805 3.688482284545898 L 2.49591064453125 29.52018165588379 C 2.249221801757812 29.97128105163574 2.425762176513672 30.36266136169434 2.513111114501953 30.51000213623047 C 2.600460052490234 30.6573314666748 2.859142303466797 31.00000190734863 3.373281478881836 31.00000190734863 L 31.62671279907227 31.00000190734863 C 32.14086151123047 31.00000190734863 32.39954376220703 30.65732192993164 32.48689270019531 30.50999069213867 C 32.57424163818359 30.36266136169434 32.75078201293945 29.97128105163574 32.50408172607422 29.52018165588379 L 18.37737274169922 3.688491821289062 C 18.1206111907959 3.21898078918457 17.67826271057129 3.168291091918945 17.50000190734863 3.168291091918945 M 17.49999809265137 2.168292999267578 C 18.18771743774414 2.168292999267578 18.87543678283691 2.515087127685547 19.25474166870117 3.208671569824219 L 33.38145065307617 29.04037094116211 C 34.11033248901367 30.37317085266113 33.14580154418945 32 31.62671279907227 32 L 3.373281478881836 32 C 1.854202270507812 32 0.8896713256835938 30.37317085266113 1.618541717529297 29.04037094116211 L 15.74526214599609 3.208671569824219 C 16.12456130981445 2.515087127685547 16.81227874755859 2.168292999267578 17.49999809265137 2.168292999267578 Z"
                          stroke="none"
                          fill="#3887fe"
                        />
                      </g>
                    </g>
                  </svg>
                </button>
              </div>
              <div className="section__title-wrapper text-center">
                <span className="section__subtitle-2">
                  <span>Our Recent</span> Projects
                </span>
                <h2 className="section__title-2">Our Handpick SEO Projects</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="row " data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-6 col-lg-6">
            <div className="recent__thumb mb-30">
              <Image src={One} alt="image not found" />
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="recent__thumb mb-30">
              <Image src={Two} alt="image not found" />
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

export default HomeProjectTwo;
