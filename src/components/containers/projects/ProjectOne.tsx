"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/recent/slider/1.webp";
import Two from "public/img/recent/slider/2.webp";
import Three from "public/img/recent/slider/3.webp";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";

const ProjectOne = () => {
  return (
    <div className="recent__area pb-120">
      <div className="container">
        <div className="recent__intro__inner mb-60">
          <div className="row align-items-end">
            <div className="col-xl-6 col-lg-6">
              <div className="recent__intro">
                <div className="section__title-wrapper">
                  <div className="section__title-3 mb-15">
                    Our Recent Projects
                  </div>
                  <p>
                    Credibly grow premier ideas rather than bricks-and-clicks
                    strategic theme areas distributed for stand-alone
                    web-readiness.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="recent__right">
                <div className="recent__view-btn">
                  <Link className="recent__btn" href="/project">
                    View All<span> Projects</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30.5"
                      height="11"
                      viewBox="0 0 30.5 11"
                    >
                      <g
                        id="Group_14479"
                        data-name="Group 14479"
                        transform="translate(-1167.5 -1688)"
                      >
                        <line
                          id="Line_48"
                          data-name="Line 48"
                          x2="23"
                          transform="translate(1167.5 1693.5)"
                          fill="none"
                          stroke="#3249b3"
                          strokeWidth="1"
                        />
                        <path
                          id="Polygon_2"
                          data-name="Polygon 2"
                          d="M5.5,0,11,9H0Z"
                          transform="translate(1198 1688) rotate(90)"
                          fill="#3249b3"
                        />
                      </g>
                    </svg>
                  </Link>
                </div>
                <div className="recent-navigation">
                  <button className="recent__button-prev">
                    <i className="fa-regular fa-angle-left"></i>
                  </button>
                  <button className="recent__button-next">
                    <i className="fa-regular fa-angle-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row " data-aos="fade-up" data-aos-delay="300">
          <div className="swiper recent__slider-active">
            <div className="swiper-wrapper">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                roundLengths={true}
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  el: ".recent__sliderpagination",
                  clickable: true,
                }}
                navigation={{
                  nextEl: ".recent__button-next",
                  prevEl: ".recent__button-prev",
                }}
                className="recent__slider-active"
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },

                  992: {
                    slidesPerView: 3,
                  },
                }}
              >
                <SwiperSlide>
                  <div className="swiper-slide">
                    <Link href="/project#portfolio">
                      <div className="recent__slider-thumb w-img">
                        <Image src={One} alt="Recent Project 1" />
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <Link href="/project#portfolio">
                      <div className="recent__slider-thumb w-img">
                        <Image src={Two} alt="Recent Project 2" />
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <Link href="/project#portfolio">
                      <div className="recent__slider-thumb w-img">
                        <Image src={Three} alt="Recent Project 3" />
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <Link href="/project#portfolio">
                      <div className="recent__slider-thumb w-img">
                        <Image src={One} alt="Recent Project 4" />
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <Link href="/project#portfolio">
                      <div className="recent__slider-thumb w-img">
                        <Image src={Two} alt="Recent Project 5" />
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide">
                    <Link href="/project#portfolio">
                      <div className="recent__slider-thumb w-img">
                        <Image src={Three} alt="Recent Project 6" />
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOne;
