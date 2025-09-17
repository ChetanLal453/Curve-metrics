import React from "react";
import Image from "next/image";

import One from "public/img/index-4/client.png";
import Two from "public/img/index-4/client-qt.png";
import Three from "public/img/index-4/client-circle.png";
import Four from "public/img/index-4/sheap-yellow.png";
import Five from "public/img/index-4/star-red.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";

const FeedbackFour = () => {
  return (
    <div className="about-us-section section-gap cus-caro">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div id="carouselExample" className="carousel slide">
              <div className="carousel-inner">
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
                    nextEl: ".carousel-control-next",
                    prevEl: ".carousel-control-prev",
                  }}
                  className="carousel__active"
                >
                  <SwiperSlide>
                    <div className="carousel-item active">
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <div>
                          <h2 className="mb-4 mb-md-5">
                            Our Clients Say <br />
                            About Us
                          </h2>
                          <p className="mb-4">
                            I was very satisfied with my decision to work with
                            Zorro on building the website for my brand, Gemini
                            Skincare. They did a great job putting the site
                            together in a timely fashion.
                          </p>
                          <h5>Chris Hughes</h5>
                          <h6>CEO | Gemini Skincare</h6>
                        </div>
                        <div className="client-img position-relative">
                          <Image
                            className="client-avatar"
                            src={One}
                            alt="Image"
                          />
                          <Image className="client-qt" src={Two} alt="Image" />
                          <Image
                            className="client-circle"
                            src={Three}
                            alt="Image"
                          />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="carousel-item">
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <div>
                          <h2 className="mb-4 mb-md-5">
                            Our Clients Say <br />
                            About Us
                          </h2>
                          <p className="mb-4">
                            I was very satisfied with my decision to work with
                            Zorro on building the website for my brand, Gemini
                            Skincare. They did a great job putting the site
                            together in a timely fashion.
                          </p>
                          <h5>Chris Hughes</h5>
                          <h6>CEO | Gemini Skincare</h6>
                        </div>
                        <div className="client-img position-relative">
                          <Image
                            className="client-avatar"
                            src={One}
                            alt="Image"
                          />
                          <Image className="client-qt" src={Two} alt="Image" />
                          <Image
                            className="client-circle"
                            src={Three}
                            alt="Image"
                          />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="carousel-item">
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <div>
                          <h2 className="mb-4 mb-md-5">
                            Our Clients Say <br />
                            About Us
                          </h2>
                          <p className="mb-4">
                            I was very satisfied with my decision to work with
                            Zorro on building the website for my brand, Gemini
                            Skincare. They did a great job putting the site
                            together in a timely fashion.
                          </p>
                          <h5>Chris Hughes</h5>
                          <h6>CEO | Gemini Skincare</h6>
                        </div>
                        <div className="client-img position-relative">
                          <Image
                            className="client-avatar"
                            src={One}
                            alt="Image"
                          />
                          <Image className="client-qt" src={Two} alt="Image" />
                          <Image
                            className="client-circle"
                            src={Three}
                            alt="Image"
                          />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="prev"
              >
                <span className="">
                  <i className="fas fa-long-arrow-alt-left"></i>
                </span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="next"
              >
                <span className="">
                  <i className="fas fa-long-arrow-alt-right"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="about-us-thumbs">
        <Image className="position-absolute left" src={Four} alt="Image" />
        <Image className="position-absolute right" src={Five} alt="Image" />
      </div>
    </div>
  );
};

export default FeedbackFour;
