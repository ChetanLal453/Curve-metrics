import React from "react";

const CallToAction = () => {
  return (
    <>
      {/* Call to Action */}
      <section className="bg-primary text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Get Your Free SEO Audit Today
        </h2>
        <p className="mb-6">Let’s unlock your business’s true potential.</p>
        <a
          href="/contact"
          className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Schedule a Call
        </a>
      </section>
    </>
  );
};

export default CallToAction;
