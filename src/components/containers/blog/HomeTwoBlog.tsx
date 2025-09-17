import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/blog/blog-author-1.png";
import Two from "public/img/blog/blog-3.jpg";

const HomeTwoBlog = () => {
  return (
    <section className="blog__area pt-120 pb-90">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-65">
              <span className="section__subtitle">
                <span>BLOG </span>POSTS
              </span>
              <h2 className="section__title">
                <span className="down__mark-line">Let&apos;s</span> Talk
              </h2>
            </div>
          </div>
        </div>
        <div
          className="row align-items-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-xl-6 col-lg-6">
            <div className="blog__content-wrapper mb-30">
              <div className="blog__content-item">
                <div className="blog__content">
                  <span>Agency</span>
                  <h3>
                    <Link href="/blog-details">
                      Why content is still king for impactful SEO campaign
                      Google in less than a minute
                    </Link>
                  </h3>
                </div>
                <div className="blog__meta">
                  <div className="blog__meta-thumb">
                    <Image src={One} alt="image not found" />
                  </div>
                  <div className="blog__meta-author">
                    <span>Aothor</span>
                    <span>24th March, 2023</span>
                  </div>
                </div>
              </div>
              <div className="blog__content-item">
                <div className="blog__content">
                  <span>Agency</span>
                  <h3>
                    <Link href="/blog-details">
                      Why content is still king for impactful SEO campaign
                      Google in less than a minute
                    </Link>
                  </h3>
                </div>
                <div className="blog__meta">
                  <div className="blog__meta-thumb">
                    <Image src={One} alt="image not found" />
                  </div>
                  <div className="blog__meta-author">
                    <span>Aothor</span>
                    <span>24th March, 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="blog__thumb-wrapper mb-30">
              <div className="blog__thumb w-img">
                <Image src={Two} alt="image not found" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTwoBlog;
