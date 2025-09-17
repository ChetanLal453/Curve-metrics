import React from "react";
import Image from "next/image";
import One from "public/img/brand/1.png";
import Two from "public/img/brand/2.png";
import Three from "public/img/brand/3.png";
import Four from "public/img/brand/4.png";
import Five from "public/img/brand/5.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";
const SponsorTwo = () => {
  return (
    <div className="brand__area pt-120 pb-120">
      <div className="container">
        <div
          className="row justify-content-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-12">
            <div className="swiper brand__active">
              <Swiper
                spaceBetween={30}
                slidesPerView={1}
                pagination={false}
                loop={true}
                navigation={false}
                className="swiper-wrapper"
                modules={[Autoplay]}
                autoplay={{
                  delay: 6000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  400: {
                    slidesPerView: 2,
                  },
                  600: {
                    slidesPerView: 3,
                  },

                  1024: {
                    slidesPerView: 4,
                  },

                  1500: {
                    slidesPerView: 5,
                  },
                }}
              >
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={One} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Two} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Three} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Four} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Five} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={One} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Two} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Three} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Four} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Five} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={One} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>

                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Two} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Three} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Four} alt="image not found" />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="swiper-slide brand__line">
                    <div className="singel__brand">
                      <Image src={Five} alt="image not found" />
                    </div>
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

export default SponsorTwo;
