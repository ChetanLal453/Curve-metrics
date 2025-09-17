import React from "react";

import Layout from "@/components/layout/Layout";
import BannerTwo from "@/components/layout/banner/BannerTwo";
import SponsorTwo from "@/components/containers/sponsor/SponsorTwo";
import AboutTwo from "@/components/containers/about/AboutTwo";
import HomeTwoCta from "@/components/containers/cta/HomeTwoCta";
import HomeTwoService from "@/components/containers/service/HomeTwoService";
import HomeTwoBoost from "@/components/containers/boost/HomeTwoBoost";
import HomeProjectTwo from "@/components/containers/projects/HomeProjectTwo";
import HomeTwoFeatures from "@/components/containers/features/HomeTwoFeatures";
import HomeTwoTeam from "@/components/containers/team/HomeTwoTeam";
import HomeTwoFeedback from "@/components/containers/feedback/HomeTwoFeedback";
import HomeTwoBlog from "@/components/containers/blog/HomeTwoBlog";

const HomeTwo = () => {
  return (
    <Layout header={2} footer={2}>
      <BannerTwo />
      <SponsorTwo />
      <AboutTwo />
      <HomeTwoCta />
      <HomeTwoService />
      <HomeTwoBoost />
      <HomeProjectTwo />
      <HomeTwoFeatures />
      <HomeTwoTeam />
      <HomeTwoFeedback />
      <HomeTwoBlog />
    </Layout>
  );
};

export default HomeTwo;
