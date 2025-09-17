import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import BlogDetailsArea from "@/components/containers/details/BlogDetailsArea";

const blogDetails = () => {
  return (
    <Layout header={5} footer={2}>
      <Banner title="Blog Single" />
      <BlogDetailsArea />
    </Layout>
  );
};

export default blogDetails;
