import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/blog/blog-author-1.png";
import Two from "public/img/blog/1/blog-03.jpg";
import Three from "public/img/blog/1/blog-02.jpg";
import Four from "public/img/blog/1/blog-04.jpg";
import Five from "public/img/blog/1/blog-05.jpg";
import Six from "public/img/blog/1/blog-06.jpg";

const BlogArea = () => {
  return (
    <div className="blog__area pt-120 pb-90">
      <div className="container">
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
                    <span>24th March, 2022</span>
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
                    <span>24th March, 2022</span>
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
              <div className="blog__thumb w-img">
                <Image src={Three} alt="image not found" />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="blog__thumb-wrapper mb-30">
              <div className="blog__thumb w-img">
                <Image src={Four} alt="image not found" />
              </div>
              <div className="blog__thumb w-img">
                <Image src={Five} alt="image not found" />
              </div>
            </div>
          </div>
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
                    <span>24th March, 2022</span>
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
                    <span>24th March, 2022</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                    <span>24th March, 2022</span>
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
                    <span>24th March, 2022</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="blog__thumb-wrapper mb-30">
              <div className="blog__thumb w-img">
                <Image src={Five} alt="image not found" />
              </div>
              <div className="blog__thumb w-img">
                <Image src={Six} alt="image not found" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArea;
