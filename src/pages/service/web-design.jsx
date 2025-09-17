import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";

const WebDesignPage = () => {
  return (
    <Layout header={5} footer={5}>
      <Banner title="Web Design" />
      <div className="container py-20">
        <h2 className="text-3xl font-bold mb-4">Web Design</h2>
        <p>
          We design modern, responsive, and SEO-optimized websites that engage
          visitors and convert them into customers.
        </p>
      </div>
    </Layout>
  );
};

export default WebDesignPage;
