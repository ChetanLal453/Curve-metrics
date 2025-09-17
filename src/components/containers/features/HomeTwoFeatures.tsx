import React, { useState } from "react";
import Image from "next/image";

import One from "public/img/shape/features-shape.png";
import Two from "public/img/features/02.png";

const HomeTwoFeatures = () => {
  const [imgTab, setImgTab] = useState(0);
  return (
    <section className="features__area p-relative features-bg pt-120 pb-30 cus-faq">
      <div className="features__pattern">
        <Image src={One} alt="image not found" />
      </div>
      <div className="container">
        <div className="row " data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-6 col-lg-6">
            <div className="features__thumb-wrapper mb-60">
              <div className="features__thumb">
                <Image src={Two} alt="image not found" />
              </div>
              <div className="features__cercle-1"></div>
              <div className="features__cercle-2 s-2"></div>
              <div className="features__shape-1">
                <div className="features__shape-content">
                  <div className="features__traffic">
                    <div className="content">
                      <span>TOTAL TRAFFIC</span>
                      <h5>123,456</h5>
                    </div>
                    <div className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18.953"
                        height="11.624"
                        viewBox="0 0 18.953 11.624"
                      >
                        <g id="trending-up" transform="translate(1.414 1.414)">
                          <path
                            id="Path_473"
                            data-name="Path 473"
                            d="M17.125,6l-6.963,6.963L6.5,9.3,1,14.8"
                            transform="translate(-1 -6)"
                            fill="none"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            id="Pathccx_474"
                            data-name="Path 474"
                            d="M17,6h4.4v4.4"
                            transform="translate(-5.273 -6)"
                            fill="none"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div className="persentence">
                    <h6>+3.48%</h6>
                    <span>Since last month</span>
                  </div>
                </div>
              </div>
              <div className="features__shape-2">
                <div className="features__shape-content">
                  <div className="features__traffic s-2">
                    <div className="content">
                      <span>TOTAL TRAFFIC</span>
                      <h5>123,456</h5>
                    </div>
                    <div className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21.397"
                        height="12.957"
                        viewBox="0 0 21.397 12.957"
                      >
                        <g
                          id="trendincxcxg-up"
                          transform="translate(1.414 1.414)"
                        >
                          <path
                            id="Path_4cc73"
                            data-name="Path 473"
                            d="M19.569,6,11.55,14.018,7.33,9.8,1,16.128"
                            transform="translate(-1 -6)"
                            fill="none"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            id="Path_4ccx74"
                            data-name="Path 474"
                            d="M17,6h5.064v5.064"
                            transform="translate(-3.496 -6)"
                            fill="none"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div className="persentence">
                    <h6 className="s-2">+3.48%</h6>
                    <span>Since last month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="features__content-wrapper">
              <div className="section__title-wrapper mb-25">
                <span className="section__subtitle">
                  <span>featured</span> campaign
                </span>
                <h2 className="section__title">
                  Getting started with an
                  <span className="down__mark-line">SEO</span> campaign
                </h2>
              </div>
              <div className="bd-faq__wrapper mb-60">
                <div
                  className="bd-faq__accordion"
                  data-aos="fade-left"
                  data-aos-duration="1000"
                >
                  <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button
                          type="button"
                          className={
                            (imgTab == 0 ? "  " : " collapsed") +
                            " accordion-button"
                          }
                          onClick={() => setImgTab(imgTab === 0 ? -1 : 0)}
                        >
                          Determine Your SEO Marketing Budget
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        className={`accordion-collapse collapse${
                          imgTab === 0 ? " show " : ""
                        }`}
                      >
                        <div className="accordion-body">
                          <p>
                            From finance, retail, and travel, to social media,
                            cybersecurity, ad tech, & more, market leaders are
                            leveraging web data to maintain their advantage.
                            Discover how it can work for you.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingTwo">
                        <button
                          className={
                            (imgTab == 1 ? "  " : " collapsed") +
                            " accordion-button"
                          }
                          onClick={() => setImgTab(imgTab === 1 ? -1 : 1)}
                        >
                          Marketing Goals and Current Site Standing
                        </button>
                      </h2>
                      <div
                        id="collapseTwo"
                        className={`accordion-collapse collapse${
                          imgTab === 1 ? " show " : ""
                        }`}
                      >
                        <div className="accordion-body">
                          <p>
                            From finance, retail, and travel, to social media,
                            cybersecurity, ad tech, & more, market leaders are
                            leveraging web data to maintain their advantage.
                            Discover how it can work for you.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingThree">
                        <button
                          className={
                            (imgTab == 2 ? "  " : " collapsed") +
                            " accordion-button"
                          }
                          onClick={() => setImgTab(imgTab === 2 ? -1 : 2)}
                        >
                          Marketing Media Collection
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        className={`accordion-collapse collapse${
                          imgTab === 2 ? " show " : ""
                        }`}
                      >
                        <div className="accordion-body">
                          <p>
                            From finance, retail, and travel, to social media,
                            cybersecurity, ad tech, & more, market leaders are
                            leveraging web data to maintain their advantage.
                            Discover how it can work for you.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingFour">
                        <button
                          className={
                            (imgTab == 3 ? "  " : " collapsed") +
                            " accordion-button"
                          }
                          onClick={() => setImgTab(imgTab === 3 ? -1 : 3)}
                        >
                          Optimization Analysis, Hold On Tight
                        </button>
                      </h2>
                      <div
                        id="collapseFour"
                        className={`accordion-collapse collapse${
                          imgTab === 3 ? " show " : ""
                        }`}
                      >
                        <div className="accordion-body">
                          <p>
                            From finance, retail, and travel, to social media,
                            cybersecurity, ad tech, & more, market leaders are
                            leveraging web data to maintain their advantage.
                            Discover how it can work for you.
                          </p>
                        </div>
                      </div>
                    </div>
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

export default HomeTwoFeatures;
