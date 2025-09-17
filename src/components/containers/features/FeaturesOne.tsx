"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";

import One from "public/img/features/b.png";
import Two from "public/img/features/g.png";
import Three from "public/img/features/r.png";
import Four from "public/img/features/t.png";

const features = [
  {
    img: One,
    title: "Business & Finance",
    desc: "We deliver secure, compliant financial software solutions for streamlined operations, enhanced decision-making, and improved data security.",
  },
  {
    img: Two,
    title: "Gaming & Entertainment",
    desc: "We provide innovative gaming and entertainment software solutions, enhancing performance and delivering immersive user experiences.",
  },
  {
    img: Three,
    title: "Retail & Distribution",
    desc: "Our software solutions optimize retail operations, inventory management, and supply chain, improving efficiency and customer satisfaction.",
  },
  {
    img: Four,
    title: "Information Technology",
    desc: "The global economy is moving towards a new identity. In order to remain competitive and profitable, the banking and finance.",
  },
];

const FeaturesOne = () => {
  return (
    <section className="features__area grey-bg-3 pt-120 pb-60">
      <div className="container">
        <div className="section__title-wrapper text-center mb-70">
          <div className="section__subtitle-3">
            <span>OUR FEATURE SERVICES</span>
          </div>
          <div className="section__title-3">
            We specialize in the features services
          </div>
        </div>

        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={4} // show 4 at a time
          loop={true} // infinite loop
          loopAdditionalSlides={10} // make looping seamless
          speed={4000} // controls smoothness
          autoplay={{
            delay: 0, // no pause, continuous flow
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // pause when hover
          }}
          freeMode={true}
          freeModeMomentum={false}
          coverflowEffect={{
            rotate: 0,
            stretch: 50,
            depth: 150,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="w-full max-w-6xl"
        >
          {features.concat(features).map((feature, i) => ( // duplicate manually for smooth belt
            <SwiperSlide
              key={i}
              className="bg-white shadow-xl rounded-2xl p-6 text-center flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-center mb-4">
                  <Image src={feature.img} alt={feature.title} width={80} height={80} />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  <Link href="/service">{feature.title}</Link>
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
              <Link
                href="/service"
                className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                VIEW DETAILS
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturesOne;
