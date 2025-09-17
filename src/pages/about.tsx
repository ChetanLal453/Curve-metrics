import React from "react";

import Layout from "@/components/layout/Layout";
import Banner from "@/components/layout/banner/Banner";
import AboutCounter from "@/components/containers/counter/AboutCounter";
import AboutMission from "@/components/containers/about/AboutMission";
import AboutTeam from "@/components/containers/team/AboutTeam";
import HomeThreeSponsor from "@/components/containers/sponsor/HomeThreeSponsor";
import HomeThreeFeedback from "@/components/containers/feedback/HomeThreeFeedback";

const about = () => {
  return (
    <Layout header={5} footer={2}>
      <Banner title="About Us" />
      <AboutCounter />
      <AboutMission />
      <AboutTeam />
      <HomeThreeSponsor />
      <HomeThreeFeedback />
    </Layout>
  );
};

export default about;
