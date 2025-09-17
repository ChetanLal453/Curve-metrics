import React from "react";

const HomeTwoCta = () => {
  return (
    <div className="cta__area p-relative pt-120 pb-6">
      <div className="cta__shape-1"></div>
      <div className="cta__shape-2"></div>
      <div className="container">
        <div className="cta__inner navy-bg include__bg cta-one-bg">
          <div className="row align-items-center">
            <div className="col-xl-5">
              <div className="section__title-wrapper mb-60">
                <h2 className="section__title-2 s-2">
                  Check your website&apos;s SEO
                </h2>
              </div>
            </div>
            <div className="col-xl-7">
              <div className="cta__search mb-60">
                <form action="#">
                  <div className="cta__search-input">
                    <input type="text" placeholder="Enter Your Website Link" />
                    <button type="submit">
                      Check Now<i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTwoCta;
