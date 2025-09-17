import React from "react";
import Image from "next/image";

import One from "public/img/shape/about-shape-1.png";
import Two from "public/img/shape/about-shape-2.png";
import Three from "public/img/shape/rectangle-3.png";
import Four from "public/img/shape/rectangle-4.png";
import Five from "public/img/about/about-thumb.png";

const AboutTwo = () => {
  return (
    <div className="about__area grey-bg z-index-11 p-relative pt-120 pb-60">
      <div className="about__shape-1">
        <Image src={One} alt="image not found" />
      </div>
      <div className="about__shape-2">
        <Image src={Two} alt="image not found" />
      </div>
      <div className="about__shape-3">
        <Image src={Three} alt="image not found" />
      </div>
      <div className="about__shape-4">
        <Image src={Four} alt="image not found" />
      </div>
      <div className="container">
        <div
          className="row align-items-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-xl-6 col-lg-6">
            <div className="about__thumb-wrapper mb-60">
              <div className="about__thumb w-img">
                <Image src={Five} alt="image not found" />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="about__content-wapper mb-60">
              <div className="section__title-wrapper mb-40">
                <span className="section__subtitle-2">
                  <span>What</span> we do
                </span>
                <h2 className="section__title-2">
                  Our Mission is to change Your View for SEO
                </h2>
              </div>
              <p>
                Smratseo is a brand of digital agency. Competen novate
                synergstic vortas through forward strategic theme areas
                Compelling extend super was that Proactive myocardinate vertical
                strategic
              </p>
              <div className="about__features-box">
                <div className="about__features-item">
                  <div className="about__features-icon">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className="about__features-content">
                    <p>
                      If Google can&apos;t crawl your site, it&apos;s not going
                      to rank
                    </p>
                    <p>- but that doesn&apos;t mean avoiding Javascript.</p>
                  </div>
                </div>
                <div className="about__features-item">
                  <div className="about__features-icon s-2">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className="about__features-content">
                    <p>
                      If Google can&apos;t crawl your site, it&apos;s not going
                      to rank
                    </p>
                    <p>- but that doesn&apos;t mean avoiding Javascript.</p>
                  </div>
                </div>
                <div className="about__features-item">
                  <div className="about__features-icon s-3">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className="about__features-content">
                    <p>
                      If Google can&apos;t crawl your site, it&apos;s not going
                      to rank
                    </p>
                    <p>- but that doesn&apos;t mean avoiding Javascript.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTwo;
