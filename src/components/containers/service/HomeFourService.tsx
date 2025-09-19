import React from "react";
import Image from "next/image";
import Link from "next/link";

// Import your images
import One from "public/img/choose/icon-1.jpg";
import Two from "public/img/choose/icon-2.jpg";
import Three from "public/img/choose/icon-3.jpg";

const HomeFourService = () => {
  const services = [
    {
      title: "Keyword Research",
      desc: "Disnone the most valuable keywords for your business to attract qualified leads and customers.",
      img: One,
    },
    {
      title: "On-Page Optimization",
      desc: "Optimize your website's content and structure to improve search engine rankings and user experience.",
      img: Two,
    },
    {
      title: "Technical SEO",
      desc: "Ensure your website is technically sound, fast, and easy for search engines to crawl and index.",
      img: Three,
    },
    {
      title: "Link Building",
      desc: "Build a strong backlink profile with high-quality, authoritative links to boost your domain authority.",
      img: One,
    },
    {
      title: "Local SEO",
      desc: "Dominate local search results and attract customers in your geographical area with targeted strategies.",
      img: Two,
    },
    {
      title: "Content Strategy",
      desc: "Develop a content plan that engages your audience and establishes your brand as an industry leader.",
      img: Three,
    },
  ];

  return (
    <>
      {/* Our SEO Services */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Our SEO Services</h2>
          <div className="row g-4">
            {services.map((service, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <div className="choose__features text-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition h-100">
                  <div className="choose__features-icon mb-4">
                    <Image
                      src={service.img}
                      alt={service.title}
                      width={150}
                      height={150}
                      style={{ objectFit: "contain" }}
                      className="mx-auto"
                    />
                  </div>
                  <div className="choose__features-content">
                    <h3 className="mb-2 text-xl font-semibold">
                      <Link href="/about">{service.title}</Link>
                    </h3>
                    <p className="text-gray-600">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeFourService;
