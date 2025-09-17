import React from "react";
import Layout from "@/components/layout/Layout";
import HomeThreeBanner from "@/components/layout/banner/HomeThreeBanner";
import HomeThreeService from "@/components/containers/service/HomeThreeService";
import HomeThreeApproach from "@/components/containers/approach/HomeThreeApproach";
import HomeThreeProject from "@/components/containers/projects/HomeThreeProject";
import HomeThreeCta from "@/components/containers/cta/HomeThreeCta";
import HomeThreeTeam from "@/components/containers/team/HomeThreeTeam";
import HomeThreeFeatures from "@/components/containers/features/HomeThreeFeatures";
import HomeThreeFeedback from "@/components/containers/feedback/HomeThreeFeedback";
import HomeThreeSponsor from "@/components/containers/sponsor/HomeThreeSponsor";
import HomeThreeBlog from "@/components/containers/blog/HomeThreeBlog";
import HomeThreeTouch from "@/components/containers/touch/HomeThreeTouch";
import HomeThreePartner from "@/components/containers/sponsor/HomeThreePartner";

const HomeThree = () => {
  return (
    <Layout header={3} footer={3}>
      <HomeThreeBanner />
      <HomeThreeService />
      <HomeThreeApproach />
      <HomeThreeProject />
      <HomeThreeCta />
      <HomeThreeTeam />
      <HomeThreeFeatures />
      <HomeThreeFeedback />
      <HomeThreeSponsor />
      <HomeThreeBlog />
      <HomeThreeTouch />
      <HomeThreePartner />
    </Layout>
  );
};

export default HomeThree;
