import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/team/01.jpg";
import Two from "public/img/team/02.jpg";
import Three from "public/img/team/03.jpg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";

const HomeTwoTeam = () => {
  return (
    <section className="team__area p-relative z-index-11 pt-120 pb-120 overflow-hidden">
      <div className="expart__cercle-1"></div>
      <div className="expart__cercle-2"></div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6 col-lg-6">
            <div className="section__title-wrapper mb-60">
              <span className="section__subtitle-2">
                <span>Our</span> expert team
              </span>
              <h2 className="section__title-2">
                Let&apos;s Collaborate With Our SEO Expert
              </h2>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="team__navigation">
              <button className="team__button-prev">
                <i className="fa-regular fa-arrow-left-long"></i>
              </button>
              <button className="team__button-next">
                <i className="fa-regular fa-arrow-right-long"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="row " data-aos="fade-up" data-aos-delay="300">
          <div className="col-12">
            <div className="swiper">
              <div className="swiper-wrapper">
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
                    nextEl: ".team__button-next",
                    prevEl: ".team__button-prev",
                  }}
                  className="team__active"
                  breakpoints={{
                    576: {
                      slidesPerView: 2,
                    },

                    992: {
                      slidesPerView: 3,
                    },
                  }}
                >
                  <SwiperSlide>
                    <div className="swiper-slide">
                      <div className="team__item">
                        <div className="team__thumb">
                          <Image src={One} alt="image not found" />
                        </div>
                        <div className="team__content">
                          <h3>
                            <Link href="/team-details">Adriano Savedra</Link>
                          </h3>
                          <p>SEO Strategies</p>
                          <div className="team__reating">
                            <span>5</span>
                            <span>
                              <i className="fa-solid fa-star"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide">
                      <div className="team__item">
                        <div className="team__thumb">
                          <Image src={Two} alt="image not found" />
                        </div>
                        <div className="team__content">
                          <h3>
                            <Link href="/team-details">Adriano Savedra</Link>
                          </h3>
                          <p>SEO Strategies</p>
                          <div className="team__reating">
                            <span>5</span>
                            <span>
                              <i className="fa-solid fa-star"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide">
                      <div className="team__item">
                        <div className="team__thumb">
                          <Image src={Three} alt="image not found" />
                        </div>
                        <div className="team__content">
                          <h3>
                            <Link href="/team-details">Adriano Savedra</Link>
                          </h3>
                          <p>SEO Strategies</p>
                          <div className="team__reating">
                            <span>5</span>
                            <span>
                              <i className="fa-solid fa-star"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide">
                      <div className="team__item">
                        <div className="team__thumb">
                          <Image src={One} alt="image not found" />
                        </div>
                        <div className="team__content">
                          <h3>
                            <Link href="/team-details">Adriano Savedra</Link>
                          </h3>
                          <p>SEO Strategies</p>
                          <div className="team__reating">
                            <span>5</span>
                            <span>
                              <i className="fa-solid fa-star"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide">
                      <div className="team__item">
                        <div className="team__thumb">
                          <Image src={Two} alt="image not found" />
                        </div>
                        <div className="team__content">
                          <h3>
                            <Link href="/team-details">Adriano Savedra</Link>
                          </h3>
                          <p>SEO Strategies</p>
                          <div className="team__reating">
                            <span>5</span>
                            <span>
                              <i className="fa-solid fa-star"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-slide">
                      <div className="team__item">
                        <div className="team__thumb">
                          <Image src={Three} alt="image not found" />
                        </div>
                        <div className="team__content">
                          <h3>
                            <Link href="/team-details">Adriano Savedra</Link>
                          </h3>
                          <p>SEO Strategies</p>
                          <div className="team__reating">
                            <span>5</span>
                            <span>
                              <i className="fa-solid fa-star"></i>
                            </span>
                          </div>
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
    </section>
  );
};

export default HomeTwoTeam;
