import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import productItem from "./project-gallery-data";

type ProjectProps = {
  id?: any;
  img?: any;
  titl?: string;
  des?: string;
  path1?: any;
  path2?: any;
  path3?: any;
  links1?: any;
  links2?: any;
  links3?: any;
  category?: any;
  area?: any;
};

const allSuggestionsData: ProjectProps[] | string[] = [
  "All",
  ...new Set(productItem.map((suggestedItem) => suggestedItem.area)),
];

const ProjectGallery = () => {
  const [suggestedItems, setSuggestedItems] = useState(productItem);

  const [suggestedFilterBtn, setSuggestedFilterBtn] =
    useState(allSuggestionsData);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const filter = (button: any) => {
    if (button === "All") {
      setSuggestedItems(productItem);
      return;
    }

    const filteredData = productItem.filter(
      (suggestedItem) => suggestedItem.area === button
    );
    setSuggestedItems(filteredData);
  };

  return (
    <section className="project__area pt-115 pb-90">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="project__filter-button text-center p-relative mb-55">
              {suggestedFilterBtn.map((cat, index) => {
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      filter(cat);
                      setSelectedIndex(index);
                    }}
                    className={
                      "filter-btn" + (selectedIndex === index ? " active" : "")
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className="row grid portfolio-grid-items "
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {suggestedItems.map((suggestedItem, index) => {
            return (
              <motion.div
                layout
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="col-xl-6 col-lg-6 col-md-6 grid-item c-3 c-2"
                key={index}
              >
                <div className="project__item mb-30">
                  <div className="project__thumb">
                    <Image src={suggestedItem.img} alt="image not found" />
                  </div>
                  <div className="project__content">
                    <h3>{suggestedItem.titl}</h3>
                    <p>{suggestedItem.des}</p>
                    <div className="project__tag">
                      <Link href="/">{suggestedItem.links1}</Link>
                      <Link href="/">{suggestedItem.links2}</Link>
                      <Link href="/">{suggestedItem.links3}</Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;
