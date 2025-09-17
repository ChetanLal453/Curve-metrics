import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/others/technical.jpg";
import Two from "public/img/svg/call.svg";
import Three from "public/img/svg/mail.svg";
import Four from "public/img/svg/location.svg";
import Five from "public/img/others/sidebar.jpg";

const TechnicalArea = () => {
  const [imgTab, setImgTab] = useState(0);

  return (
    <section className="technical__area pt-120 pb-60 cus-faq">
      <div className="container">
        <div className="row " data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-8 col-lg-12">
            <div className="technical__main-wrapper mb-60">
              <div className="technical__thumb mb-45">
                <Image src={One} alt="Image" />
              </div>
              <div className="technical__content mb-35">
                <div className="technical__title">
                  <h3>Creative Solutions With Technical SEO</h3>
                </div>
                <p>
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don&apos;t
                  look even slightly believable. If you are going to use a
                  passage of Lorem Ipsum, you need to be sure there isn&apos;t
                  anything embarrassing hidden in the middle of text. All the
                  Lorem Ipsum
                </p>
              </div>
              <div className="technical__content">
                <div className="technical__title">
                  <h3>Solving Problems, Building Brands</h3>
                </div>
                <p>
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don&apos;t
                  look even slightly believable. If you are going to use a
                  passage of Lorem Ipsum, you need to be sure there isn&apos;t
                  anything embarrassing hidden in the middle of text. All the
                  Lorem Ipsum
                </p>
              </div>
              <div className="bd-faq__wrapper-2 mb-45 mt-40">
                <div className="bd-faq__accordion style-2">
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
                            Our search engine optimization packages range
                            between $3000 $10,000 a month depending upon the
                            industry and the quality of the current website.
                            SEO, consulting for marketing strategies and SEO
                            campaigns are for clients looking for high-impact
                            results.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingTwo">
                        <button
                          type="button"
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
                            Our search engine optimization packages range
                            between $3000 $10,000 a month depending upon the
                            industry and the quality of the current website.
                            SEO, consulting for marketing strategies and SEO
                            campaigns are for clients looking for high-impact
                            results.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingThree">
                        <button
                          type="button"
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
                            Our search engine optimization packages range
                            between $3000 $10,000 a month depending upon the
                            industry and the quality of the current website.
                            SEO, consulting for marketing strategies and SEO
                            campaigns are for clients looking for high-impact
                            results.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingFour">
                        <button
                          type="button"
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
                            Our search engine optimization packages range
                            between $3000 $10,000 a month depending upon the
                            industry and the quality of the current website.
                            SEO, consulting for marketing strategies and SEO
                            campaigns are for clients looking for high-impact
                            results.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="technical__content">
                <div className="technical__title">
                  <h3>Challenge And Solutions</h3>
                </div>
                <p>
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don&apos;t
                  look even slightly believable. If you are going to use a
                  passage of Lorem Ipsum, you need to be sure there isn&apos;t
                  anything embarrassing hidden in the middle of text. All the
                  Lorem Ipsum
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6">
            <div className="sideber__widget">
              <div className="sideber__widget-item mb-40">
                <div className="sidebar__category">
                  <ul>
                    <li>
                      <Link href="/">Technical SEO</Link>
                    </li>
                    <li>
                      <Link href="/">PPC Management</Link>
                    </li>
                    <li>
                      <Link href="/">Performance Content</Link>
                    </li>
                    <li>
                      <Link href="/">Lead Generation</Link>
                    </li>
                    <li>
                      <Link href="/">Strategic Planning </Link>
                    </li>
                    <li>
                      <Link href="/">Product Consultation </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="sideber__widget-item mb-40">
                <div className="sidebar__contact">
                  <div className="sidebar__contact-title mb-35">
                    <h3>Contact Info</h3>
                  </div>
                  <div className="sidebar__contact-inner">
                    <div className="sidebar__contact-item">
                      <div className="sideber__contact-icon">
                        <Image src={Two} alt="Image" />
                      </div>
                      <div className="sideber__contact-text">
                        <span>
                          <a href="tel:+(123)123-456-7890">
                            +(123)123-456-7890
                          </a>
                        </span>
                      </div>
                    </div>
                    <div className="sidebar__contact-item">
                      <div className="sideber__contact-icon">
                        <Image src={Three} alt="Image" />
                      </div>
                      <div className="sideber__contact-text">
                        <span>
                          <a href="mailto:seofest@example.com">
                            seofest@example.com
                          </a>
                        </span>
                      </div>
                    </div>
                    <div className="sidebar__contact-item">
                      <div className="sideber__contact-icon">
                        <Image src={Four} alt="Image" />
                      </div>
                      <div className="sideber__contact-text">
                        <span>Boise, Idaho 83702 USA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sideber__widget-item">
                <div className="slideber__thumb w-img">
                  <Image src={Five} alt="Image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalArea;
