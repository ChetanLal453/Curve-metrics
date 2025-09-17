import React from "react";
import Image from "next/image";

import One from "public/img/shape/feedback-pattren.png";
import Two from "public/img/feedback/review-1.png";
import Three from "public/img/feedback/review-2.png";
import Four from "public/img/feedback/feedback-1.jpg";
import Five from "public/img/feedback/author-1.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";

const HomeThreeFeedback = () => {
  return (
    <section className="feedback__area pt-120 pb-60 bg-white">
      <div className="feedback__pattren">
        <Image src={One} alt="image not found" />
      </div>
      <div className="container">
        <div className="row " data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-6 col-lg-6">
            <div className="feedback__content-wrapper mb-60">
              <div className="section__title-wrapper">
                <span className="section__subtitle">
                  <span>customer </span> feedback
                </span>
                <h2 className="section__title mb-30">
                  Our <span className="down__mark-line">customers</span>
                  feedback about us
                </h2>
              </div>
              <p>
                Get the heavy metal debit card that saves and invests for you
                every time you spend, with Real-Time Roun Ups, Sm eposit, no
                hidden fees, over 55,000.
              </p>
              <div className="feedback__review-wrapper mb-60">
                <h6>Find more reviews on</h6>
                <div className="feedback__review-inner">
                  <div className="feedback__review-item">
                    <div className="eedback__review-thumb">
                      <Image src={Two} alt="Image" />
                    </div>
                    <div className="feedback__review-icon">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <div className="feedback__review-text">
                      <h6>4.7</h6>
                      <span>(327 Reviews)</span>
                    </div>
                  </div>
                  <div className="feedback__review-item">
                    <div className="eedback__review-thumb">
                      <Image src={Three} alt="Image" />
                    </div>
                    <div className="feedback__review-icon">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <div className="feedback__review-text">
                      <h6>4.5</h6>
                      <span>(327 Reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="feedback__navigation">
                <button className="feedback-3__button-prev">
                  <i className="fa-regular fa-arrow-left-long"></i>
                </button>
                <button className="feedback-3__button-next">
                  <i className="fa-regular fa-arrow-right-long"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="feedback__right mb-60">
              <div className="feedbacK__thumb">
                <Image src={Four} alt="image not found" />
                <div className="feedbacK__content-wrapper space">
                  <div className="feedback__active">
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={30}
                      loop={true}
                      roundLengths={true}
                      modules={[Autoplay, Navigation]}
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                      }}
                      navigation={{
                        nextEl: ".feedback-3__button-next",
                        prevEl: ".feedback-3__button-prev",
                      }}
                      className="feedback__active-three"
                    >
                      <SwiperSlide>
                        <div className="feedbacK__content">
                          <div className="feedback__review-icon">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                          </div>
                          <p>
                            We increased our B2B SaaS client&apos;s website
                            traffic by over 300% in just 3 months. We were able
                            to do this by targeting their website visitors
                            through the use of SEO optimized content
                          </p>
                          <div className="feedback__meta">
                            <div className="feedback__meta-author">
                              <h5>Neal Kapur</h5>
                              <span>Head of Marketing at Glossy</span>
                            </div>
                            <div className="feedback__meta-thumb">
                              <Image src={Five} alt="image not found" />
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="feedbacK__content">
                          <div className="feedback__review-icon">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                          </div>
                          <p>
                            We increased our B2B SaaS client&apos;s website
                            traffic by over 300% in just 3 months. We were able
                            to do this by targeting their website visitors
                            through the use of SEO optimized content
                          </p>
                          <div className="feedback__meta">
                            <div className="feedback__meta-author">
                              <h5>Neal Kapur</h5>
                              <span>Head of Marketing at Glossy</span>
                            </div>
                            <div className="feedback__meta-thumb">
                              <Image src={Five} alt="image not found" />
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="feedbacK__content">
                          <div className="feedback__review-icon">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                          </div>
                          <p>
                            We increased our B2B SaaS client&apos;s website
                            traffic by over 300% in just 3 months. We were able
                            to do this by targeting their website visitors
                            through the use of SEO optimized content
                          </p>
                          <div className="feedback__meta">
                            <div className="feedback__meta-author">
                              <h5>Neal Kapur</h5>
                              <span>Head of Marketing at Glossy</span>
                            </div>
                            <div className="feedback__meta-thumb">
                              <Image src={Five} alt="image not found" />
                            </div>
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
    </section>
  );
};

export default HomeThreeFeedback;
