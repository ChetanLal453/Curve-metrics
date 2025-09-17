import React from "react";
import Link from "next/link";

const ProjectCta = () => {
  return (
    <section className="cta__area sky-bg pt-120 pb-120">
      <div className="container">
        <div className="row " data-aos="fade-up" data-aos-delay="300">
          <div className="cta__wrapper text-center">
            <div className="section__title-wrapper mb-90">
              <h2 className="section__title">
                Access your business potentials today & find opportunity for
                bigger success
              </h2>
            </div>
            <Link className="cta__btn" href="/">
              Start A Project Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCta;
