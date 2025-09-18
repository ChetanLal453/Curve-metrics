import React from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import One from "public/img/choose/icon-1.jpg";
import Two from "public/img/choose/icon-2.jpg";
import Three from "public/img/choose/icon-3.jpg";
import Four from "public/img/hero/hero-thumb-3.webp";
import { IoIosArrowRoundDown } from "react-icons/io";

const SeoPage = () => {
  return (
    <Layout header={5} footer={5}>
      {/* Hero Section */}
      <Banner title="SEO Services That Drive Real Results" />

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
            Businesses need SEO to stay visible, credible, and competitive in the digital age. SEO helps you attract quality traffic, build trust, and deliver long-term ROI.
          </p>
          <p className="fst-italic text-secondary" style={{ fontSize: "1rem" }}>
            75% of users never go past the first page of Google.
          </p>
        </div>
      </section>


      {/* Our SEO Services */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Our SEO Services</h2>
          <div className="row g-4"> {/* Added g-4 for spacing */}
            {[
              {
                title: "Keyword Research",
                desc: "Disnone the most valuable keywords for your business to attract qualified leads and customers.",
                img: One
              },
              {
                title: "On-Page Optimization",
                desc: "Optimize your website's content and structure to improve search engine rankings and user experience.",
                img: Two
              },
              {
                title: "Technical SEO",
                desc: "Ensure your website is technically sound, fast, and easy for search engines to crawl and index.",
                img: Three
              },
              {
                title: "Link Building",
                desc: "Build a strong backlink profile with high-quality, authoritative links to boost your domain authority.",
                img: One
              },
              {
                title: "Local SEO",
                desc: "Dominate local search results and attract customers in your geographical area with targeted strategies.",
                img: Two
              },
              {
                title: "Content Strategy",
                desc: "Develop a content plan that engages your audience and establishes your brand as an industry leader.",
                img: Three
              },
            ].map((service, i) => (
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



      {/* SEO Service Details */}
      <section className="service-content remove-space py-32 mt-110">
        <h2 className="text-3xl font-bold mb-12 text-center page-dual-title">
          Our Process
        </h2>
        <div className="container mx-auto">

          {/* 1. Website On-Page Analysis */}
          <div className="row align-items-center mb-16">
            <div className="col-md-7">
              <h4 className="page-dual-title fade-in text-2xl lg:text-3xl mb-4">WEBSITE ON-PAGE ANALYSIS</h4>
              <p className="text-lg text-gray-700 mb-6">
                Getting your website a once-over can do no harm. Especially for your business, giving it a once-over might actually help. Here are some benefits of on-page analysis.
              </p>
              <ul className="list-unstyled space-y-6">
                {[
                  { title: "Content Improvement", desc: "Content is an essential part of any website. Our writers are trained in writing SEO friendly content that can boost traffic on your website.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Content-improvement.png" },
                  { title: "Competitor Analysis", desc: "With good on-page research you can learn more about your competition.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Competitor-analysis.png" },
                  { title: "Faster Loading", desc: "We ensure the page is running smooth, rectifying CSS and HTML tags to cut loading time.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Faster-Loading.png" },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image src={item.img} alt={item.title} width={70} height={70} style={{ objectFit: "contain" }} />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg"><strong>{item.title}</strong> – {item.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/01-img.png" alt="Website On-Page Analysis" width={350} height={350} style={{ width: "100%", height: "auto", objectFit: "none" }} />
            </div>

          </div>

          {/* 2. Keyword Research */}
          <div className="row align-items-center mb-16 flex-md-row-reverse">
            <div className="col-md-7">
              <h4 className="page-dual-title text-2xl lg:text-3xl mb-4">KEYWORD RESEARCH</h4>
              <p className="text-lg text-gray-700 mb-6">
                Keywords have a solid impact on the organic page rank of a website. Ranking on top increases visibility and clicks.
              </p>
              <ul className="list-unstyled space-y-6">
                {[
                  { title: "Audience Behavior", desc: "Keyword research is performed based on audience behavior related to the domain.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Audience-behavior.png" },
                  { title: "Market Trends", desc: "Detailed keyword research reveals market trends that can be pursued to reel in profit.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Market-trends.png" },
                  { title: "Quality Traffic", desc: "Targeted keywords bring relevant audience and better conversion rates.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Quality-traffic.png" },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image src={item.img} alt={item.title} width={70} height={70} style={{ objectFit: "contain" }} />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg"><strong>{item.title}</strong> – {item.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/02-img.png" alt="Keyword Research" width={400} height={400} style={{ width: "100%", height: "auto", objectFit: "none" }} />
            </div>
          </div>


          {/* 3. Meta Tag Optimization */}
          <div className="row align-items-center mb-16">
            <div className="col-md-7">
              <h4 className="page-dual-title text-2xl lg:text-3xl mb-4">META TAG OPTIMIZATION</h4>
              <p className="text-lg text-gray-700 mb-6">Meta tags are essential to boost your click rate in any organic search result.</p>
              <ul className="list-unstyled space-y-6">
                {[
                  { title: "Search Engine Friendly", desc: "Search engines read meta tags to compare searched keywords with content.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Search-engine-friendly.png" },
                  { title: "Reader Friendly", desc: "Meta tags allow users to know what your website offers compared to others.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Reader-friendly.png" },
                  { title: "Higher Ranking", desc: "Optimized meta tags provide clarity to search engines and boost rank.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Higher-ranking.png" },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image src={item.img} alt={item.title} width={70} height={70} style={{ objectFit: "contain" }} />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg"><strong>{item.title}</strong> – {item.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/03-img.png" alt="Meta Tag Optimization" width={400} height={400} style={{ width: "100%", height: "auto", objectFit: "none" }} />
            </div>
          </div>

          {/* 4. Content Optimization */}
          <div className="row align-items-center mb-16 flex-md-row-reverse">
            <div className="col-md-7">
              <h4 className="page-dual-title text-2xl lg:text-3xl mb-4">CONTENT OPTIMIZATION</h4>
              <p className="text-lg text-gray-700 mb-6">‘Content is King’. Compelling content is essential for SEO and user engagement.</p>
              <ul className="list-unstyled space-y-6">
                {[
                  { title: "Educating Users", desc: "Content provides comprehensive guidance to users about your brand.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Educating-users.png" },
                  { title: "SEO Tool", desc: "Content helps in ranking, establishing page and domain authority.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/SEO-Tool.png" },
                  { title: "Voice of the Brand", desc: "Content optimization helps your brand convey its goals and motives.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Voice.png" },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image src={item.img} alt={item.title} width={70} height={70} style={{ objectFit: "contain" }} />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg"><strong>{item.title}</strong> – {item.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/04-img.png" alt="Content Optimization" width={400} height={400} style={{ width: "100%", height: "auto", objectFit: "none" }} />
            </div>
          </div>

          {/* 5. Website Structure Optimization */}
          <div className="row align-items-center mb-16">
            <div className="col-md-7">
              <h4 className="page-dual-title text-2xl lg:text-3xl mb-4">WEBSITE STRUCTURE OPTIMIZATION</h4>
              <p className="text-lg text-gray-700 mb-6">Optimizing website structure improves usability, SEO, and user trust.</p>
              <ul className="list-unstyled space-y-6">
                {[
                  { title: "User Friendly", desc: "Optimized structure makes your website user-friendly and builds trust.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/User-friendly.png" },
                  { title: "Increased Visibility", desc: "Better website structure can attract quality traffic.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Increased-Visibility.png" },
                  { title: "Top SEO Ranks", desc: "Structure optimization boosts SEO and ranks your site higher.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Top-SEO-ranks.png" },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image src={item.img} alt={item.title} width={70} height={70} style={{ objectFit: "contain" }} />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg"><strong>{item.title}</strong> – {item.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/05-img.png" alt="Website Structure Optimization" width={400} height={400} style={{ width: "100%", height: "auto", objectFit: "none" }} />
            </div>
          </div>

          {/* 6. Page Load Time Optimization */}
          <div className="row align-items-center mb-16 flex-md-row-reverse">
            <div className="col-md-7">
              <h4 className="page-dual-title text-2xl lg:text-3xl mb-4">PAGE LOAD TIME OPTIMIZATION</h4>
              <p className="text-lg text-gray-700 mb-6">Faster loading websites improve user retention, SEO, and conversions.</p>
              <ul className="list-unstyled space-y-6">
                {[
                  { title: "Marketing Goals", desc: "Load time optimization can help reach marketing goals and improve SEO.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Marketing-goals.png" },
                  { title: "Conversion & Revenue", desc: "Faster websites increase conversion rates and revenue.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Revenue.png" },
                  { title: "SEO Positioning", desc: "Website load time is a key factor in search engine ranking.", img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/SEO-pos.png" },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image src={item.img} alt={item.title} width={70} height={70} style={{ objectFit: "contain" }} />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg"><strong>{item.title}</strong> – {item.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/06-img.png" alt="Page Load Time Optimization" width={400} height={400} style={{ width: "100%", height: "auto", objectFit: "none" }} />
            </div>
          </div>

        </div>
      </section>

      {/* Key Stats */}
      <section className="key-stats py-20 bg-gray-50 mt-150">
        <div className="container mx-auto">
          <div className="row text-center mb-12">
            <h2 className="title-underline page-dual-title text-uppercase text-3xl font-bold">
              KEY STATS
            </h2>
          </div>

          <div className="row align-items-center">
            {/* Left Column */}
            <div className="col-md-4 col-sm-12 space-y-8">
              {[
                {
                  img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/KEY-STATS-icon-01.png",
                  text: "A full proof plan of action that makes us the best SEO service provider in India.",
                },
                {
                  img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/KEY-STATS-icon-02.png",
                  text: "Through analysis of your website before planning a strategy.",
                },
                {
                  img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/KEY-STATS-icon-03.png",
                  text: "Equal attention and effort to on-page and off-page activities.",
                },
              ].map((item, i) => (
                <div key={i} className="stats-section flex flex-col items-center text-center">
                  <img src={item.img} alt={item.text} className="w-16 h-16 mb-3" />
                  <div className="stats-desc">
                    <span className="stats-heading text-gray-700">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Center Image */}
            <div className="col-md-4 col-sm-12 flex justify-center my-8 md:my-0">
              <img
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/KEY-STATS.png"
                alt="Key stats"
                className="w-72 md:w-80 h-auto"
              />
            </div>

            {/* Right Column */}
            <div className="col-md-4 col-sm-12 space-y-8">
              {[
                {
                  img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/KEY-STATS-icon-04.png",
                  text: "Completion of work in the given deadline.",
                },
                {
                  img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/KEY-STATS-icon-05.png",
                  text: "Keep our SEO tactics updated to the current market for providing you the best service.",
                },
                {
                  img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/KEY-STATS-icon-06.png",
                  text: "Prepare and reviewing a plan of action and change as per needs.",
                },
              ].map((item, i) => (
                <div key={i} className="stats-section flex flex-col items-center text-center">
                  <img src={item.img} alt={item.text} className="w-16 h-16 mb-3" />
                  <div className="stats-desc">
                    <span className="stats-heading text-gray-700">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>








      {/* Why Choose Us */}
      <section id="our-work-sec" className="py-20 bg-white">
        <div className="container mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h6 className="text-blue-600 font-semibold">WHY CHOOSE US</h6>
            <h2 className="text-3xl font-bold uppercase mb-4 relative inline-block">
              WHY CHOOSE US
              <span className="block w-16 h-1 bg-blue-600 mx-auto mt-2"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here at Digital Infoways, we offer these six values to our clients
              which sets us apart from others.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="flex flex-wrap -mx-4">
            {[
              {
                title: "You are the Priority",
                description:
                  "The constantly expanding workforce will ensure the full capacity of the work ensuring the completion of your work regardless of the priority.",
                img: "https://digitalinfoways.com/wp-content/uploads/2021/01/you-are-the-priority.png",
              },
              {
                title: "Honesty and Hard Work",
                description:
                  "We value honesty and hard work at Digital Infoways above everything else which has made us recognized as one of the loyal digital marketing agency in this industry.",
                img: "https://digitalinfoways.com/wp-content/uploads/2020/12/Experience.png",
              },
              {
                title: "Our Methods and Tactics",
                description:
                  "The strategies of our digital marketing company are well tested in the market which will deliver a definite spike in your business.",
                img: "https://digitalinfoways.com/wp-content/uploads/2021/01/our-methods-and-tactics.png",
              },
              {
                title: "Cost-effective Project Management",
                description:
                  "We employ a series of cost-effective tactics that will help you get a good ROI on your website.",
                img: "https://digitalinfoways.com/wp-content/uploads/2020/12/Cost.png",
              },
              {
                title: "Satisfied Client Base",
                description:
                  "We have a rich client base that is happy with all the work that we are putting for their marketing efforts.",
                img: "https://digitalinfoways.com/wp-content/uploads/2020/12/Satisfied-Client.png",
              },
              {
                title: "Flexible Working Models",
                description:
                  "We are flexible regarding our working model that can give us better results and new ways to execute our tactics.",
                img: "https://digitalinfoways.com/wp-content/uploads/2020/12/flexible.png",
              },
            ].map((card, index) => (
              <div key={index} className="w-full md:w-1/2 px-4 mb-8">
                <div
                  className={`flex flex-col md:flex-row items-center bg-white border shadow p-6 rounded-lg ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img src={card.img} alt={card.title} className="w-20 h-20" />
                  </div>
                  {/* Text */}
                  <div className="ml-0 md:ml-6 md:mr-6 mt-4 md:mt-0 text-center md:text-left">
                    <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Testimonials */}
      <section className="bg-gray-50 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">Testimonials</h2>
        <div className="max-w-3xl mx-auto">
          <blockquote className="p-6 bg-white rounded-2xl shadow">
            <p className="text-gray-700 italic mb-4">
              “They helped us rank on page one within 6 months. Our traffic has
              skyrocketed!”
            </p>
            <footer className="text-sm font-semibold">– Happy Client</footer>
          </blockquote>
        </div>
      </section>

      {/* FAQ Section */}
    
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="row align-items-center mb-16">
              <h2 className="text-3xl font-bold uppercase mb-4 relative inline-block">
              FAQ
              <span className="block w-16 h-1 bg-blue-600 mx-auto mt-2"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Something on your mind? Find all your answers here!
            </p>
            <div className="col-md-7">
              
            
            <div className="md:w-1/2 space-y-4 order-1 md:order-1">
              {[
                {
                  question: "Do I need to sign a contract with Digital Infoways?",
                  answer: "Not really. We don’t want to bother with multiple documents that will bind you. From our experience, good work goes a long way.",
                },
                {
                  question: "How will I measure the progress of the SEO campaign?",
                  answer: "The experts working on your website will track all progress and prepare detailed reports showing the campaign performance.",
                },
                {
                  question: "What would you need to start the SEO campaign?",
                  answer: "We need two types of information: first, your business details including USP, target audience, and profit margin; second, marketing requirements like budget and website changes.",
                },
                {
                  question: "Will my website be on top after optimization?",
                  answer: "SEO results depend on competition and ongoing efforts. Continuous updates and new content are required to maintain top positions.",
                },
              ].map((faq, index) => (
                <details key={index} className="p-4 border rounded-lg group">
                  <summary className="font-semibold cursor-pointer flex justify-between items-center">
                    {faq.question}
                    <span className="transition-transform duration-300 group-open:rotate-45 inline-block">+</span>
                  </summary>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
            </div>
            
            <div className="col-md-5">
              <Image src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/05-img.png" alt="Website Structure Optimization" width={400} height={400} style={{ width: "100%", height: "auto", objectFit: "none" }} />
            </div>
          </div>
          </div>
        </div>
      </section>

      



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
    </Layout>
  );
};

export default SeoPage;
