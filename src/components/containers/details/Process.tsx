import React from "react";
import Image from "next/image";

const SeoProcess = () => {
  return (
    <>
      {/* SEO Service Details */}
      <section className="service-content remove-space py-32 mt-110">
        <h2 className="text-3xl font-bold mb-12 text-center page-dual-title">
          Our Process
        </h2>
        <div className="container mx-auto">
          {/* 1. Website On-Page Analysis */}
          <div className="row align-items-center mb-16">
            <div className="col-md-7">
              <h4 className="page-dual-title fade-in text-2xl lg:text-3xl mb-4">
                WEBSITE ON-PAGE ANALYSIS
              </h4>
              <p className="text-lg text-gray-700 mb-6">
                Getting your website a once-over can do no harm. Especially for
                your business, giving it a once-over might actually help. Here
                are some benefits of on-page analysis.
              </p>
              <ul className="list-unstyled space-y-6">
                {[
                  {
                    title: "Content Improvement",
                    desc: "Content is an essential part of any website. Our writers are trained in writing SEO friendly content that can boost traffic on your website.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Content-improvement.png",
                  },
                  {
                    title: "Competitor Analysis",
                    desc: "With good on-page research you can learn more about your competition.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Competitor-analysis.png",
                  },
                  {
                    title: "Faster Loading",
                    desc: "We ensure the page is running smooth, rectifying CSS and HTML tags to cut loading time.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Faster-Loading.png",
                  },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={70}
                          height={70}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg">
                          <strong>{item.title}</strong> – {item.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/01-img.png"
                alt="Website On-Page Analysis"
                width={350}
                height={350}
                style={{ width: "100%", height: "auto", objectFit: "none" }}
              />
            </div>
          </div>

          {/* 2. Keyword Research */}
          <div className="row align-items-center mb-16 flex-md-row-reverse">
            <div className="col-md-7">
              <h4 className="page-dual-title text-2xl lg:text-3xl mb-4">
                KEYWORD RESEARCH
              </h4>
              <p className="text-lg text-gray-700 mb-6">
                Keywords have a solid impact on the organic page rank of a
                website. Ranking on top increases visibility and clicks.
              </p>
              <ul className="list-unstyled space-y-6">
                {[
                  {
                    title: "Audience Behavior",
                    desc: "Keyword research is performed based on audience behavior related to the domain.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Audience-behavior.png",
                  },
                  {
                    title: "Market Trends",
                    desc: "Detailed keyword research reveals market trends that can be pursued to reel in profit.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Market-trends.png",
                  },
                  {
                    title: "Quality Traffic",
                    desc: "Targeted keywords bring relevant audience and better conversion rates.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Quality-traffic.png",
                  },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={70}
                          height={70}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg">
                          <strong>{item.title}</strong> – {item.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/02-img.png"
                alt="Keyword Research"
                width={400}
                height={400}
                style={{ width: "100%", height: "auto", objectFit: "none" }}
              />
            </div>
          </div>

          {/* 3. Meta Tag Optimization */}
          <div className="row align-items-center mb-16">
            <div className="col-md-7">
              <h4 className="page-dual-title text-2xl lg:text-3xl mb-4">
                META TAG OPTIMIZATION
              </h4>
              <p className="text-lg text-gray-700 mb-6">
                Meta tags have a significant impact on SEO performance. They
                help search engines understand your page content.
              </p>
              <ul className="list-unstyled space-y-6">
                {[
                  {
                    title: "Title Tag",
                    desc: "Optimizing title tags to improve ranking and click-through rates.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Title-tag.png",
                  },
                  {
                    title: "Description Tag",
                    desc: "Well-crafted descriptions that boost page visibility and attract visitors.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Description-tag.png",
                  },
                  {
                    title: "Keyword Placement",
                    desc: "Strategically placing keywords in meta tags for maximum SEO impact.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Keyword-placement.png",
                  },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={70}
                          height={70}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg">
                          <strong>{item.title}</strong> – {item.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/03-img.png"
                alt="Meta Tag Optimization"
                width={350}
                height={350}
                style={{ width: "100%", height: "auto", objectFit: "none" }}
              />
            </div>
          </div>

          {/* 4. Content Optimization */}
          <div className="row align-items-center mb-16 flex-md-row-reverse">
            <div className="col-md-7">
              <h4 className="page-dual-title text-2xl lg:text-3xl mb-4">
                CONTENT OPTIMIZATION
              </h4>
              <p className="text-lg text-gray-700 mb-6">
                High-quality, optimized content helps increase organic traffic
                and engagement.
              </p>
              <ul className="list-unstyled space-y-6">
                {[
                  {
                    title: "SEO-Friendly Writing",
                    desc: "Content tailored to both search engines and readers.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Seo-friendly-writing.png",
                  },
                  {
                    title: "Content Structure",
                    desc: "Proper use of headings, lists, and media for better readability.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Content-structure.png",
                  },
                  {
                    title: "Keyword Integration",
                    desc: "Balanced keyword usage without overstuffing.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Keyword-integration.png",
                  },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={70}
                          height={70}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg">
                          <strong>{item.title}</strong> – {item.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/04-img.png"
                alt="Content Optimization"
                width={400}
                height={400}
                style={{ width: "100%", height: "auto", objectFit: "none" }}
              />
            </div>
          </div>

          {/* 5. Website Structure Optimization */}
          <div className="row align-items-center mb-16">
            <div className="col-md-7">
              <h4 className="page-dual-title text-2xl lg:text-3xl mb-4">
                WEBSITE STRUCTURE OPTIMIZATION
              </h4>
              <p className="text-lg text-gray-700 mb-6">
                An optimized website structure ensures better crawlability and
                indexing by search engines.
              </p>
              <ul className="list-unstyled space-y-6">
                {[
                  {
                    title: "Internal Linking",
                    desc: "Building logical connections between pages.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Internal-linking.png",
                  },
                  {
                    title: "Sitemap Creation",
                    desc: "Helping search engines navigate the website easily.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Sitemap-creation.png",
                  },
                  {
                    title: "Clean URL Structure",
                    desc: "Short, descriptive, SEO-friendly URLs.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Clean-url.png",
                  },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={70}
                          height={70}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg">
                          <strong>{item.title}</strong> – {item.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/05-img.png"
                alt="Website Structure Optimization"
                width={350}
                height={350}
                style={{ width: "100%", height: "auto", objectFit: "none" }}
              />
            </div>
          </div>

          {/* 6. Page Load Time Optimization */}
          <div className="row align-items-center mb-16 flex-md-row-reverse">
            <div className="col-md-7">
              <h4 className="page-dual-title text-2xl lg:text-3xl mb-4">
                PAGE LOAD TIME OPTIMIZATION
              </h4>
              <p className="text-lg text-gray-700 mb-6">
                Faster websites provide better user experiences and higher
                search engine rankings.
              </p>
              <ul className="list-unstyled space-y-6">
                {[
                  {
                    title: "Image Optimization",
                    desc: "Compressing and resizing images without losing quality.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Image-optimization.png",
                  },
                  {
                    title: "Code Minification",
                    desc: "Reducing unnecessary CSS, JS, and HTML.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Code-minification.png",
                  },
                  {
                    title: "Caching Strategy",
                    desc: "Leveraging browser caching for faster repeat visits.",
                    img: "https://www.digitalinfoways.com/wp-content/uploads/2020/12/Caching-strategy.png",
                  },
                ].map((item, i) => (
                  <li key={i} className="mb-6">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <Image
                          src={item.img}
                          alt={item.title}
                          width={70}
                          height={70}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="col-md-10">
                        <p className="text-lg">
                          <strong>{item.title}</strong> – {item.desc}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5">
              <Image
                src="https://www.digitalinfoways.com/wp-content/uploads/2020/12/06-img.png"
                alt="Page Load Time Optimization"
                width={400}
                height={400}
                style={{ width: "100%", height: "auto", objectFit: "none" }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SeoProcess;
