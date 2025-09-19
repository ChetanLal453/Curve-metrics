import React from "react";
import Image from "next/image";

const FaqSection = () => {
  const faqs = [
    {
      question: "Do I need to sign a contract with Digital Infoways?",
      answer:
        "Not really. We don’t want to bother with multiple documents that will bind you. From our experience, good work goes a long way.",
    },
    {
      question: "How will I measure the progress of the SEO campaign?",
      answer:
        "The experts working on your website will track all progress and prepare detailed reports showing the campaign performance.",
    },
    {
      question: "What would you need to start the SEO campaign?",
      answer:
        "We need two types of information: first, your business details including USP, target audience, and profit margin; second, marketing requirements like budget and website changes.",
    },
    {
      question: "Will my website be on top after optimization?",
      answer:
        "SEO results depend on competition and ongoing efforts. Continuous updates and new content are required to maintain top positions.",
    },
  ];

  return (
    <>
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase mb-4 relative inline-block">
              FAQ
              <span className="block w-16 h-1 bg-blue-600 mx-auto mt-2"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Something on your mind? Find all your answers here!
            </p>
          </div>

          {/* FAQ + Image Grid */}
          <div className="row align-items-center">
            {/* Left Side - FAQs */}
            <div className="col-md-7">
              <div className="md:w-1/2 space-y-4 order-1 md:order-1">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="p-4 border rounded-lg group bg-white shadow-sm hover:shadow-md transition"
                  >
                    <summary className="font-semibold cursor-pointer flex justify-between items-center">
                      {faq.question}
                      <span className="transition-transform duration-300 group-open:rotate-45 inline-block">
                        +
                      </span>
                    </summary>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="col-md-5 mt-8 md:mt-0">
              <Image
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/05-img.png"
                alt="Website Structure Optimization"
                width={400}
                height={400}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "none",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FaqSection;
