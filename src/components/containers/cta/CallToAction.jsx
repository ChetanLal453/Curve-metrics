import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

const testimonials = [
  {
    text: "Digital Infoways revamped our website with colourful design and fonts. Customer-friendly and easily navigable e-commerce site. Speed has remarkably improved. So glad we chose Digital Infoways for our first website. It is performing very well.",
    author: "Brent Williams",
  },
  {
    text: "Work quality is just remarkable. Their diligent and effective work helped us in growing our business. They accepted all the challenges open-heartedly and not only provided the solution but the response was quick and prompt. There is a substantial increase in revenue.",
    author: "Robert Hensley",
  },
  {
    text: "Thanks to the entire team for support and hard work. There were many loopholes in our website because of which we were not getting enough clients. The team rectified the whole website and within a short time, enough traffic was generated which enhanced the return on investment.",
    author: "Rushil Shah",
  },
  {
    text: "We have improved our SEO traffic. Kudos to the whole team. Trustworthy team with a strategic SEO Campaign plan. It gave us an edge over our competitors. Eagerly waiting to work in future.",
    author: "Clinton Fryman",
  },
];

const TestimonialsContact = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const prevTestimonial = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="testimonials-contact py-12">
      <div className="container">
        {/* Header Info */}
        <div className="row info text-center mb-8">
          <h6 className="mb-2">CLIENTS AND TESTIMONIAL</h6>
          <h2 className="title-underline mb-4">CLIENTS AND TESTIMONIAL</h2>
          <p className="second-info">
            Listen to what our happy clients have to say about us.
          </p>
        </div>

        <div className="row">
          {/* Left Side - Testimonials + Logos */}
          <div className="col-lg-6 col-md-6 col-sm-12">
            {/* Client Logos */}
            <div className="space-one flex flex-wrap gap-4 mb-6">
              <img
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/08/Picture.png"
                style={{ width: "170px" }}
                alt="Client Logo 1"
              />
              <img
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/08/Picture3.png"
                style={{ width: "170px" }}
                alt="Client Logo 2"
              />
              <img
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/08/Picture2.png"
                style={{ width: "170px" }}
                alt="Client Logo 3"
              />
            </div>
            <div className="space-one flex flex-wrap gap-4 mb-6">
              <img
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/08/bans.png"
                style={{ width: "170px" }}
                alt="Client Logo 4"
              />
              <img
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/08/Picture4.png"
                style={{ width: "170px" }}
                alt="Client Logo 5"
              />
              <img
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/08/Picture5.png"
                style={{ width: "170px" }}
                alt="Client Logo 6"
              />
            </div>

            {/* Carousel Testimonials */}
            <div className="testimonial-container py-12 bg-gray-100">
              <div className="testimonial-card max-w-3xl mx-auto relative">
                <Carousel
                  activeIndex={index}
                  onSelect={handleSelect}
                  interval={5000}
                  fade
                  indicators={false}
                  controls={false} // hide default controls
                >
                  {testimonials.map((testimonial, i) => (
                    <Carousel.Item key={i}>
                      <div className="p-6 bg-white rounded shadow text-center">
                        <p className="testimonial-text mb-4">{testimonial.text}</p>
                        <h4 className="testimonial-author mt-2 font-semibold">{testimonial.author}</h4>
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>

                {/* Custom Prev/Next Buttons */}
                <div className="flex justify-between mt-4">
                  <button className="nav-button px-4 py-2 bg-purple-600 text-white rounded" onClick={prevTestimonial}>
                    Prev
                  </button>
                  <button className="nav-button px-4 py-2 bg-purple-600 text-white rounded" onClick={nextTestimonial}>
                    Next
                  </button>
                </div>

                {/* Ratings */}
                <div className="testimonial-ratings text-center rating-test mt-4">
                  <ul className="rate0 flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <li key={i}>
                        <img
                          width="16"
                          height="27"
                          src="/wp-content/uploads/2020/09/stars.png"
                          alt="Rating"
                        />
                      </li>
                    ))}
                  </ul>
                  <p>4.9/5 based on 43 ratings and reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2 className="get mb-4">Get In Touch</h2>
            <form className="wpcf7-form space-y-4">
              <input
                type="text"
                name="yourname"
                className="form-control user-name mb-3"
                placeholder="Your Name"
              />
              <input
                type="email"
                name="email"
                className="form-control mail mb-3"
                placeholder="Your Email"
              />
              <input
                type="number"
                name="Phone"
                className="form-control pno mb-3"
                placeholder="Your Phone Number"
              />
              <textarea
                name="Message"
                rows="6"
                className="form-control mb-3"
                placeholder="Your Message"
              ></textarea>
              <input
                type="submit"
                value="Submit"
                className="btn-outline2 w-full mt-2"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsContact;
