import React from "react";
import Link from "next/link";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const AboutCounter = () => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <section className="fact__area pt-120 pb-90 bg-white">
      <div className="container">
        <div className="row " data-aos="fade-up" data-aos-delay="300">
          <div className="col-xl-4">
            <div className="fact__item mb-30">
              <div className="fact__count">
                <div className="fact__number">
                  <span className="counter" ref={ref}>
                    {inView && <CountUp start={0} end={45} duration={3} />}
                  </span>
                </div>
                <div className="fact__letter">
                  <span>k</span>
                  <span className="plus">+</span>
                </div>
              </div>
              <div className="fact__content">
                <h3>
                  <Link href="/">Succeeded projects</Link>
                </h3>
                <p>Projects Completed</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="fact__item mb-30">
              <div className="fact__count">
                <div className="fact__number">
                  <span className="counter" ref={ref}>
                    {inView && <CountUp start={0} end={7140} duration={3} />}
                  </span>
                </div>
                <div className="fact__letter">
                  <span>k</span>
                  <span className="plus">+</span>
                </div>
              </div>
              <div className="fact__content">
                <h3>
                  <Link href="/">Succeeded projects</Link>
                </h3>
                <p>Projects Completed</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="fact__item mb-30">
              <div className="fact__count">
                <div className="fact__number">
                  <span className="counter" ref={ref}>
                    {inView && <CountUp start={0} end={502} duration={3} />}
                  </span>
                </div>
                <div className="fact__letter">
                  <span>k</span>
                  <span className="plus">+</span>
                </div>
              </div>
              <div className="fact__content">
                <h3>
                  <Link href="/">Succeeded projects</Link>
                </h3>
                <p>Projects Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCounter;
