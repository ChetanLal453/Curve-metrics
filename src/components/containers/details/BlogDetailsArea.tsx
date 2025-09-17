import React from "react";
import Image from "next/image";
import Link from "next/link";

import Arrow from "public/img/svg/arrow.svg";

import One from "public/img/blog/blog-big.jpg";
import Two from "public/img/blog/blog-author-1.png";
import Three from "public/img/svg/blockquote.svg";

import Four from "public/img/blog/postbox-author.png";

const BlogDetailsArea = () => {
  return (
    <section className="postbox__area pt-120 pb-60">
      <div className="container">
        <div
          className="row justify-content-center "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="col-xl-10 col-lg-12">
            <div className="postbox__wrapper mb-60">
              <div className="blog__thumb w-img mb-45">
                <Image src={One} alt="image not found" />
              </div>
              <div className="blog__meta mb-45">
                <div className="blog__meta-thumb">
                  <Image src={Two} alt="image not found" />
                </div>
                <div className="blog__meta-author">
                  <span>Aothor</span>
                  <span>24th March, 2022</span>
                </div>
              </div>
              <div className="postbox__text mb-35">
                <h3 className="postbox__title">
                  Creative Solutions With Technical SEO
                </h3>
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
              <div className="postbox__text">
                <h3 className="postbox__title">
                  Solving Problems, Building Brands
                </h3>
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
              <div className="blockquote___wrapper mt-45 mb-40">
                <div className="blockquote">
                  <div className="blockquote__icon">
                    <Image src={Three} alt="Image" />
                  </div>
                  <div className="blockquote__content">
                    <h3>
                      If your plans don&apos;t include mobile, your plans are
                      finished glamorous or inspiring
                    </h3>
                    <span>Harry Mrque</span>
                  </div>
                </div>
              </div>
              <div className="blog__features">
                <div className="blog__features-content">
                  <h3>
                    Tip 1: Use Calling To Quickly Access Features or Perform
                    Tasks
                  </h3>
                  <p>
                    There are many variations of passages of Lorem Ipsum
                    available, but the majority have suffered alteration in some
                    form, by injected humour, or randomised words which
                    don&apos;t look even slightly believable. If you are going
                    to use a passage of Lorem Ipsum, you need to be sure there
                    isn&apos;t anything embarrassing hidden in the middle of
                    text. All the Lorem Ipsum
                  </p>
                </div>
                <div className="blog__features__list">
                  <ul>
                    <li>
                      <Image src={Arrow} alt="Image" />
                      How to make recommendations
                    </li>
                    <li>
                      <Image src={Arrow} alt="Image" />
                      Effective ways to communicate
                    </li>
                    <li>
                      <Image src={Arrow} alt="Image" />
                      Using multiple communication channels
                    </li>
                    <li>
                      <Image src={Arrow} alt="Image" />
                      Effective ways to communicate
                    </li>
                    <li>
                      <Image src={Arrow} alt="Image" />
                      Answering sales or support questions
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mb-40">
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don&apos;t look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn&apos;t anything
                embarrassing hidden in the middle of text. All the Lorem Ipsum
              </p>
              <div className="blog__features-content">
                <h3>Conclution</h3>
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
            <div className="postbox__tag-wrapper mb-40">
              <div className="postbox__tag-title">Tags:</div>
              <div className="postbox__tag">
                <Link href="/">Call Center</Link>
                <Link href="/">Best Practices</Link>
                <Link href="/">Support</Link>
              </div>
            </div>
            <div className="postbox-wrapper-2 mb-60">
              <div className="postbox__meta mb-40">
                <div className="postbox__meta-icon">
                  <Image src={Four} alt="Image" />
                </div>
                <div className="postbox__meta-content">
                  <div className="postbox__author-inner">
                    <div className="postbox__author">
                      <h4>Martin Alex</h4>
                      <span>Blog Admin</span>
                    </div>
                    <div className="touch__social">
                      <Link href="/">
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                      <Link href="/">
                        <i className="fa-brands fa-twitter"></i>
                      </Link>
                      <Link href="/">
                        <i className="fa-brands fa-youtube"></i>
                      </Link>
                      <Link href="/">
                        <i className="fa-brands fa-linkedin"></i>
                      </Link>
                    </div>
                  </div>
                  <p>
                    orem ipsum dolor sit amet, cibo mundi ea duo, vim exerci
                    phaedrum. There are many variations of passages of Lorem
                    Ipsum
                  </p>
                </div>
              </div>
              <div className="blog__nav-items">
                <div className="single__nav">
                  <div className="single__nav-btn">
                    <Link href="/">
                      <i className="fa-light fa-arrow-left-long"></i>
                    </Link>
                  </div>
                  <div className="blog-content">
                    <span>Previous Post</span>
                  </div>
                </div>
                <div className="dot-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                  >
                    <g
                      id="Group_5129"
                      data-name="Group 5129"
                      transform="translate(-633.197 -4179.197)"
                    >
                      <rect
                        id="Rectangle_971"
                        data-name="Rectangle 971"
                        width="15"
                        height="15"
                        transform="translate(633.197 4179.197)"
                        fill="#2f2f2f"
                      />
                      <rect
                        id="Rectangle_974"
                        data-name="Rectangle 974"
                        width="15"
                        height="15"
                        transform="translate(633.197 4197.197)"
                        fill="#2f2f2f"
                      />
                      <rect
                        id="Rectangle_972"
                        data-name="Rectangle 972"
                        width="15"
                        height="15"
                        transform="translate(651.197 4179.197)"
                        fill="#2f2f2f"
                      />
                      <rect
                        id="Rectangle_973"
                        data-name="Rectangle 973"
                        width="15"
                        height="15"
                        transform="translate(651.197 4197.197)"
                        fill="#2f2f2f"
                      />
                    </g>
                  </svg>
                </div>
                <div className="single__nav">
                  <div className="blog-content">
                    <span>Next Post</span>
                  </div>
                  <div className="single__nav-btn">
                    <Link href="/">
                      <i className="fa-light fa-arrow-right-long"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="postbox__comment-form pt-50">
                <h3 className="postbox__comment-form-title">Leave A Comment</h3>
                <form action="#">
                  <div className="row">
                    <div className="col-xxl-12">
                      <div className="postbox__comment-input mb-30">
                        <textarea placeholder="Start type..."></textarea>
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="postbox__comment-input mb-30">
                        <input type="text" placeholder="your name" />
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="postbox__comment-input mb-30">
                        <input type="email" placeholder="your email" />
                      </div>
                    </div>
                    <div className="col-xxl-12">
                      <div className="postbox__comment-btn mt-5">
                        <button className="solid__btn" type="submit">
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;
