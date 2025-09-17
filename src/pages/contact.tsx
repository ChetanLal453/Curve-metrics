import React from "react";
import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import HomeThreeTouch from "@/components/containers/touch/HomeThreeTouch";
import ContactMap from "@/components/containers/cta/ContactMap";

const contact = () => {
  return (
    <Layout header={5} footer={2}>
      <Banner title="Contact" />
      <HomeThreeTouch />
      <ContactMap />
    </Layout>
  );
};

export default contact;
