import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";

const DigitalMarketingPage = () => {
  return (
    <Layout header={5} footer={5}>
      <Banner title="Digital Marketing" />
      <div className="container py-20">
        <h2 className="text-3xl font-bold mb-4">Digital Marketing</h2>
        <p>
          From social media campaigns to Google Ads and email marketing, we
          create strategies that grow your brand and drive ROI.
        </p>
      </div>
    </Layout>
  );
};

export default DigitalMarketingPage;
