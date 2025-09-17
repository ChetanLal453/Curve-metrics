import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import HomeThreeService from "@/components/containers/service/HomeThreeService";
import HomeThreeFeatures from "@/components/containers/features/HomeThreeFeatures";
import ServiceBoost from "@/components/containers/boost/ServiceBoost";
import ServiceCta from "@/components/containers/cta/ServiceCta";

const service = () => {
  return (
    <Layout header={5} footer={5}>
      <Banner title="Services" />
      <HomeThreeService />
      <HomeThreeFeatures />
      <ServiceBoost />
      <ServiceCta />
    </Layout>
  );
};

export default service;
