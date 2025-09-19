import React from "react";
import Image from "next/image";
import Four from "public/img/hero/hero-thumb-3.webp";

const AboutMatters = () => {
  return (
    <>
      {/* Why SEO Matters */}
      <section className="row align-items-center aos-init aos-animate py-5">
        {/* Left Side - Image */}
        <div className="col-xl-6 col-lg-6 mb-4 mb-lg-0">
          <Image
            src={Four}
            alt="Why SEO Matters"
            className="rounded-lg shadow-lg w-100"
            style={{ objectFit: "none", height: "100%" }}
          />
        </div>

        {/* Right Side - Text */}
        <div className="col-xl-6 col-lg-6 text-center text-lg-start">
          <span
            className="text-primary font-semibold text-uppercase mb-2 d-block"
            style={{ fontSize: "1.2rem" }}
          >
            Why SEO Matters
          </span>
          <h2 className="mb-4" style={{ fontSize: "2.5rem" }}>
            Boost Your Online Visibility & Credibility
          </h2>
          <p className="mb-3 text-muted" style={{ fontSize: "1.1rem" }}>
            Businesses need SEO to stay visible, credible, and competitive in the
            digital age. SEO helps you attract quality traffic, build trust, and
            deliver long-term ROI.
          </p>
          <p className="fst-italic text-secondary" style={{ fontSize: "1rem" }}>
            75% of users never go past the first page of Google.
          </p>
        </div>
      </section>
    </>
  );
};

export default AboutMatters;
