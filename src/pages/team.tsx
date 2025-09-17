import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import TeamArea from "@/components/containers/details/TeamArea";
import ServiceCtaTwo from "@/components/containers/cta/ServiceCtaTwo";

const team = () => {
  return (
    <Layout header={5} footer={5}>
      <Banner title="Our SEO Expert" />
      <TeamArea />
      <ServiceCtaTwo />
    </Layout>
  );
};

export default team;
