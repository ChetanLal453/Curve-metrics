"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";

import One from "public/img/features/b.png";
import Two from "public/img/features/g.png";
import Three from "public/img/features/r.png";

const features = [
  {
    img: One,
    title: "SEO Services",
    desc: "Boost your visibility, rank higher on Google, and attract qualified leads with our SEO strategies.",
    url: "/service/seo",
  },
  {
    img: Two,
    title: "Web Design",
    desc: "Modern, responsive, and SEO-friendly websites designed to convert visitors into customers.",
    url: "/service/web-design",
  },
  {
    img: Three,
    title: "Digital Marketing",
    desc: "Grow your brand with data-driven marketing campaigns across social media, ads, and more.",
    url: "/service/digital-marketing",
  },
];

const FeaturesOne = () => {
  const swiperRef = useRef(null);

  const handleSlideChangeTransitionEnd = (swiper) => {
    // Pause only when the active slide is centered
    if (swiper.autoplay) {
      swiper.autoplay.stop();
      setTimeout(() => {
        if (swiper.autoplay) swiper.autoplay.start();
      }, 3000); // 3 sec pause
    }
  };

  return (
    <section className="features__area grey-bg-3 pt-120 pb-60">
      <div className="container">
        <div className="section__title-wrapper text-center mb-70">
          <div className="section__subtitle-3">
            <span>OUR FEATURE SERVICES</span>
          </div>
          <div className="section__title-3">
            We specialize in these featured services
          </div>
        </div>

        <Swiper
          ref={swiperRef}
          slidesPerView={3}
          spaceBetween={30}
          loop={true}
          centeredSlides={true}
          speed={5000} // smooth belt speed
          freeMode={true}
          freeModeMomentum={false}
          grabCursor={true}
          autoplay={{
            delay: 0, // continuous
            disableOnInteraction: false,
          }}
          onSlideChangeTransitionEnd={handleSlideChangeTransitionEnd}
          modules={[Autoplay]}
          className="w-full max-w-6xl"
        >
          {/* Duplicate slides for seamless belt */}
          {features.concat(features).map((feature, i) => (
            <SwiperSlide key={i} className="!h-auto">
              <Link
                href={feature.url}
                className="block bg-white shadow-xl rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 h-full"
              >
                <div className="flex justify-center mb-4">
                  <Image
                    src={feature.img}
                    alt={feature.title}
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
                <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                  VIEW DETAILS
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturesOne;
