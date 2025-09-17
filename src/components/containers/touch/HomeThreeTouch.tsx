import React from "react";
import Link from "next/link";

const HomeThreeTouch = () => {
  return (
    <section
      className="touch__arae touch-bg include__bg pt-120"
      data-background="assets/img/shape/touch-shape.png"
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-lg-4">
            <div className="touch__left mb-60">
              <div className="section__title-wrapper">
                <span className="section__subtitle s-2">
                  <span>Get </span>in touch
                </span>
                <h2 className="section__title s-2 mb-30">
                  <span className="down__mark-line">Let&apos;s</span> Talk
                </h2>
              </div>
              <p>
                We&apos;ve been growing businesses since 2009, let us do it for
                you!
              </p>
              <div className="touch__search">
                <form action="#">
                  <input type="text" placeholder="Enter Mail" />
                  <button type="submit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11.83"
                      height="20.026"
                      viewBox="0 0 11.83 20.026"
                    >
                      <path
                        id="Path_17020"
                        data-name="Path 17020"
                        d="M-3925.578,5558.542l7.623,8.242-7.623,7.543"
                        transform="translate(3927.699 -5556.422)"
                        fill="none"
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                    </svg>
                  </button>
                </form>
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
          </div>
          <div className="col-xl-8 col-lg-8">
            <div className="touch__contact p-relative">
              <div className="touch__carcle"></div>
              <div className="touch__content-title">
                <h3>Schedule a Consultation</h3>
              </div>
              <form action="#">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input type="text" placeholder="First Name" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input type="text" placeholder="Last Name" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input type="text" placeholder="Company Name" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input type="text" placeholder="Website" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input type="text" placeholder="Monthly Budget" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input type="text" placeholder="Phone Number" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="touch__input">
                      <input type="text" placeholder="Email" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="contact__select mb-20">
                      <select>
                        <option value="0">Select the services</option>
                        <option value="1">Payment</option>
                        <option value="2">Information</option>
                        <option value="3">Option</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="touch__submit">
                      <div className="sign__action">
                        <input
                          className="e-check-input"
                          type="checkbox"
                          id="sing-up"
                        />
                        <label className="sign__check" htmlFor="sing-up">
                          Accept Our{" "}
                          <span>
                            <Link href="/">Terms</Link> &{" "}
                            <Link href="/">Conditions</Link>
                          </span>
                        </label>
                      </div>
                      <div className="touch__btn">
                        <button type="button"></button>
                        <button className="border__btn" type="submit">
                          Submit Query
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeThreeTouch;
