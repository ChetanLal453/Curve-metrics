"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/choose/icon-1.jpg";
import Two from "public/img/choose/icon-2.jpg";
import Three from "public/img/choose/icon-3.jpg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";

const ChooseOne = () => {
  const features = [
    { img: One, title: "Custom Software Development", desc: "Whether it's building robust web applications or developing tailored business solutions, our expertise in PHP frameworks like Laravel, Symfony, and CodeIgniter ensures your project is built on a solid foundation." },
    { img: Two, title: "WordPress Development", desc: "Powering over 40% of the web, WordPress is our go-to platform for creating custom websites, blogs, and eCommerce stores. Our team of experts can help you harness its full potential through custom themes, plugin development." },
    { img: Three, title: "Digital Marketing", desc: "Beyond development, we elevate your brand with a results-driven digital marketing strategy. From SEO to PPC campaigns, we ensure your website ranks higher, attracts the right audience, and converts visitors into customers" },
  ];

  return (
    <section className="choose__area pt-120">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6 col-lg-7">
            <div className="section__title-wrapper mb-40">
              <div className="section__subtitle-3">
                <span>WHY CHOOSE US</span>
              </div>
              <div className="section__title-3">
                For Over 10 Years.<br />
                For 100+ of Users.
              </div>
              <br />
              <p>
                At Curve Metrics, we specialize in delivering cutting-edge software
                development and digital marketing solutions tailored to your business
                needs. With a strong focus on PHP frameworks and WordPress, we craft
                dynamic, scalable, and feature-rich websites that help you stay ahead
                in today’s digital world.
              </p>
            </div>
          </div>
          <div className="col-xl-6 col-lg-5">
            <div className="choouse__pagination-wrapper text-lg-end">
              <div className="choose__pagination"></div>
            </div>
          </div>
        </div>

        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-12">
            <div className="choose__line">
              <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                roundLengths={true}
                modules={[Autoplay, Pagination]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  el: ".choose__pagination",
                  clickable: true,
                }}
                className="choose__active"
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1200: { slidesPerView: 3 },
                }}
              >
                {features.concat(features).map((item, i) => (
                  <SwiperSlide key={i}>
                    <div className="choose__features">
                      <div className="choose__features-icon">
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={350}   // 👈 control size
                          height={350}
                          style={{ objectFit: "contain" }} // 👈 makes it fit without stretching
                        />
                      </div>
                      <div className="choose__features-content">
                        <h3>
                          <Link href="/about">{item.title}</Link>
                        </h3>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseOne;
