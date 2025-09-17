import React from "react";
import Layout from "@/components/layout/Layout";
import HomeFourBanner from "@/components/layout/banner/HomeFourBanner";
import HomeFourProject from "@/components/containers/projects/HomeFourProject";
import HomeFourOffer from "@/components/containers/offer/HomeFourOffer";
import HomeFourVideo from "@/components/containers/offer/HomeFourVideo";
import FeedbackFour from "@/components/containers/feedback/FeedbackFour";
import ClientList from "@/components/containers/feedback/ClientList";
import Idea from "@/components/containers/feedback/Idea";
const HomeFour = () => {
  return (
    <Layout header={4} footer={4}>
      <HomeFourBanner />
      <HomeFourProject />
      <HomeFourOffer />
      <HomeFourVideo />
      <FeedbackFour />
      <ClientList />
      <Idea />
    </Layout>
  );
};

export default HomeFour;
