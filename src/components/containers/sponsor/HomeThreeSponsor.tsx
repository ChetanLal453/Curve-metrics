"use client";

import React from "react";
import Image from "next/image";

import One from "public/img/brand/1.webp";
import Two from "public/img/brand/2.webp";
import Three from "public/img/brand/3.webp";
import Four from "public/img/brand/4_clean.png";
import Five from "public/img/brand/5_clean.png";
import Six from "public/img/brand/6_clean.png";
import Seven from "public/img/brand/7.webp";
import Eight from "public/img/brand/8_clean.png";
import Nine from "public/img/brand/9_clean.png";
import Ten from "public/img/brand/10_clean.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";

const SponsorOne = () => {
  const brands = [One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten];

  return (
    <div className="brand__area grey-bg-2 pt-120 pb-120">
      <div className="container">
        <div className="brand__title text-center mb-10">
          <span>Thousands of companies trusted us</span>
        </div>

        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={4} // show only 4 cards at once
          loop={true}
          loopAdditionalSlides={20}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,   // rotation angle
            stretch: 0,   // spacing between cards
            depth: 250,   // depth in 3D
            modifier: 1,
            slideShadows: true,
          }}
          modules={[Autoplay, EffectCoverflow]}
          className="w-full max-w-6xl"
        >
          {brands.concat(brands).map((img, i) => (
            <SwiperSlide key={i} className="flex justify-center items-center">
              <div className="bg-white rounded-2xl shadow-xl p-6 flex justify-center items-center w-48 h-32">
                <Image
                  src={img}
                  alt={`brand-${i + 1}`}
                  width={290}
                  height={120}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SponsorOne;
