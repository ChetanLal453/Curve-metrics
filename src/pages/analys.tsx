import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import AnalysArea from "@/components/containers/details/AnalysArea";

const analys = () => {
  return (
    <Layout header={5} footer={2}>
      <Banner title="Analys & Backup Blockchain" />
      <AnalysArea />
    </Layout>
  );
};

export default analys;
