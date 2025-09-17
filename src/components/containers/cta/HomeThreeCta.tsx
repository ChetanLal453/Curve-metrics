import React from "react";
import Link from "next/link";

const HomeThreeCta = () => {
  return (
    <section className="project__cta-area">
      <div className="container">
        <div className="row align-items-sm-start">
          <div className="col-xl-4 col-lg-5">
            <div className="project__title">
              <h3>SEO Agency According to Your Needs</h3>
            </div>
          </div>
          <div className="col-xl-5 col-lg-4">
            <div className="project__paragraph">
              <p>
                We use the latest SEO and digital marketing best practices to
                boost your brand. Our team supports yours, as much as is needed.
              </p>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3">
            <div className="project__view text-lg-end">
              <Link className="solid__btn" href="/team">
                View All Expert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeThreeCta;
