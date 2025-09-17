import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import BlogArea from "@/components/containers/details/BlogArea";

const blog = () => {
  return (
    <Layout header={5} footer={2}>
      <Banner title="Latest Blog" />
      <BlogArea />
    </Layout>
  );
};

export default blog;
