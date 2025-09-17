import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/team/01.jpg";
import Two from "public/img/team/02.jpg";
import Three from "public/img/team/03.jpg";
import Four from "public/img/team/04.jpg";
import Five from "public/img/team/05.jpg";
import Six from "public/img/team/06.jpg";
import Seven from "public/img/team/07.jpg";
import Eight from "public/img/team/08.jpg";
import Nine from "public/img/team/09.jpg";

const TeamArea = () => {
  return (
    <section className="team__area pt-120 pb-90">
      <div className="container">
        <div className="row " data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="team__item mb-30">
              <div className="team__thumb">
                <Image src={One} alt="image not found" />
              </div>
              <div className="team__content">
                <h3>
                  <Link href="/">Adriano Savedra</Link>
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
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="team__item mb-30">
              <div className="team__thumb">
                <Image src={Two} alt="image not found" />
              </div>
              <div className="team__content">
                <h3>
                  <Link href="/">Adriano Savedra</Link>
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
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="team__item mb-30">
              <div className="team__thumb">
                <Image src={Three} alt="image not found" />
              </div>
              <div className="team__content">
                <h3>
                  <Link href="/">Adriano Savedra</Link>
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
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="team__item mb-30">
              <div className="team__thumb">
                <Image src={Four} alt="image not found" />
              </div>
              <div className="team__content">
                <h3>
                  <Link href="/">Adriano Savedra</Link>
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
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="team__item mb-30">
              <div className="team__thumb">
                <Image src={Five} alt="image not found" />
              </div>
              <div className="team__content">
                <h3>
                  <Link href="/">Adriano Savedra</Link>
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
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="team__item mb-30">
              <div className="team__thumb">
                <Image src={Six} alt="image not found" />
              </div>
              <div className="team__content">
                <h3>
                  <Link href="/">Adriano Savedra</Link>
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
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="team__item mb-30">
              <div className="team__thumb">
                <Image src={Seven} alt="image not found" />
              </div>
              <div className="team__content">
                <h3>
                  <Link href="/">Adriano Savedra</Link>
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
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="team__item mb-30">
              <div className="team__thumb">
                <Image src={Eight} alt="image not found" />
              </div>
              <div className="team__content">
                <h3>
                  <Link href="/">Adriano Savedra</Link>
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
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="team__item mb-30">
              <div className="team__thumb">
                <Image src={Nine} alt="image not found" />
              </div>
              <div className="team__content">
                <h3>
                  <Link href="/">Adriano Savedra</Link>
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
        </div>
      </div>
    </section>
  );
};

export default TeamArea;
