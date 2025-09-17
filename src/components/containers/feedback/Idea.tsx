import React from "react";
import Image from "next/image";
import Link from "next/link";

import One from "public/img/index-4/light.png";
import Two from "public/img/index-4/arrow.svg";

const Idea = () => {
  return (
    <div className="idea-section section-gap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="idea-top-title d-flex gap-3 justify-content-between align-items-center">
              <h2 className="position-relative">
                Have An Idea? <br />
                Let&apos;s Build & Scale It!
                <Image className="position-absolute" src={One} alt="Image" />
              </h2>
              <Link href="/" className="bg-warning circle-btn">
                <Image src={Two} alt="Image" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Idea;
