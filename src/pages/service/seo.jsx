import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";

const SeoPage = () => {
  return (
    <Layout header={5} footer={5}>
      <Banner title="SEO Services" />
      <div className="container py-20">
        <h2 className="text-3xl font-bold mb-4">SEO Services</h2>
        <p>
          We help your business rank higher on search engines with keyword
          research, on-page SEO, technical SEO, and link-building strategies.
        </p>
      </div>
    </Layout>
  );
};

export default SeoPage;
