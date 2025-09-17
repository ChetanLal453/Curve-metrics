import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/team/expart-thumb.jpg";

const HomeThreeTeam = () => {
  return (
    <section className="expart__area p-relative z-index-11 pt-120 pb-60">
      <div className="expart__cercle-1"></div>
      <div className="expart__cercle-2"></div>
      <div className="container">
        <div className="expart__top mb-70">
          <div
            className="row align-items-center "
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="col-xl-6 col-lg-6">
              <div className="section__title-wrapper">
                <span className="section__subtitle">
                  <span>Our</span> expert team
                </span>
                <h2 className="section__title">
                  Let&apos;s Collaborate With Our
                  <span className="down__mark-line">SEO</span> SEO Expert
                </h2>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="expart__view text-lg-end">
                <Link className="border__btn" href="/team">
                  View All Expert
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className="row align-items-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-xl-6 col-lg-6">
            <div className="expart__content-wrapper mb-60">
              <div className="expart__service-item">
                <div className="expart__content">
                  <h3>
                    <Link href="/team">Adriano Savedra</Link>
                  </h3>
                  <p>SEO Strategies</p>
                  <div className="expart__reating">
                    <span>5</span>
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                  </div>
                </div>
                <div className="expart__link">
                  <Link href="/team">
                    <i className="fa-light fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
              <div className="expart__service-item">
                <div className="expart__content">
                  <h3>
                    <Link href="/team">Grace Charlotte</Link>
                  </h3>
                  <p>Marketing Expert</p>
                  <div className="expart__reating">
                    <span>5</span>
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                  </div>
                </div>
                <div className="expart__link">
                  <Link href="/team">
                    <i className="fa-light fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
              <div className="expart__service-item">
                <div className="expart__content">
                  <h3>
                    <Link href="/team">Jack Alexander</Link>
                  </h3>
                  <p>Marketing Expert</p>
                  <div className="expart__reating">
                    <span>5</span>
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                  </div>
                </div>
                <div className="expart__link">
                  <Link href="/team">
                    <i className="fa-light fa-arrow-right-long"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="expart__thumb mb-60">
              <Image src={One} alt="image not found" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeThreeTeam;
