import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import TechnicalArea from "@/components/containers/cta/TechnicalArea";
import TechnicalProject from "@/components/containers/projects/TechnicalProject";

const technical = () => {
  return (
    <Layout header={5} footer={2}>
      <Banner title="Technical SEO" />
      <TechnicalArea />
      <TechnicalProject />
    </Layout>
  );
};

export default technical;
