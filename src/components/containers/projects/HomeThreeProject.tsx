import React from "react";
import Image from "next/image";

import One from "public/img/shape/dot.png";
import Two from "public/img/project/project-thumb.jpg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";

const HomeThreeProject = () => {
  return (
    <div className="project__area p-relative z-index-1 pt-120 pb-120">
      <div className="container">
        <div
          className="row align-items-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-xl-4 col-lg-5">
            <div className="section__left mb-60">
              <div className="section__title-wrapper mb-45">
                <span className="section__subtitle">
                  <span>Our</span> Recent Projects
                </span>
                <h2 className="section__title mb-35">
                  Our <span className="down__mark-line">Hand</span>pick SEO
                  Projects
                </h2>
                <p>
                  Cold pressed before they sold out flexitarian chicharrones.
                  Retro lo-fi hot chicken.
                </p>
              </div>
              <div className="project__navigation">
                <button className="recent-2__button-prev">
                  <i className="fa-regular fa-angle-left"></i>
                </button>
                <button className="recent-2__button-next">
                  <i className="fa-regular fa-angle-right"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-lg-7">
            <div className="projet__thumb-wrapper">
              <div className="project__shape-1">
                <Image className="parallaxed" src={One} alt="image not found" />
              </div>
              <div className="project__shape-2">
                <Image className="parallaxed" src={One} alt="image not found" />
              </div>
              <div className="projet__thumb-inner">
                <div className="project__active">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    roundLengths={true}
                    modules={[Autoplay, Navigation]}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    navigation={{
                      nextEl: ".recent-2__button-next",
                      prevEl: ".recent-2__button-prev",
                    }}
                    className="recent__slider-active-3"
                  >
                    <SwiperSlide>
                      <div className="project__item">
                        <div className="projet__thumb w-im">
                          <Image src={Two} alt="image not found" />
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="project__item">
                        <div className="projet__thumb w-im">
                          <Image src={Two} alt="image not found" />
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="project__item">
                        <div className="projet__thumb w-im">
                          <Image src={Two} alt="image not found" />
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="project__item">
                        <div className="projet__thumb w-im">
                          <Image src={Two} alt="image not found" />
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeThreeProject;
