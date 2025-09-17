import React from "react";
import Layout from "@/components/layout/Layout";
import HomeBannerOne from "@/components/layout/banner/HomeBannerOne";
import SponsorOne from "@/components/containers/sponsor/SponsorOne";
import ChooseOne from "@/components/containers/choose/ChooseOne";
import AboutOne from "@/components/containers/about/AboutOne";
import FeaturesOne from "@/components/containers/features/FeaturesOne";
import SoftwareOne from "@/components/containers/software/SoftwareOne";
import ProjectOne from "@/components/containers/projects/ProjectOne";
import WorkOne from "@/components/containers/work/WorkOne";
import FeedbackOne from "@/components/containers/feedback/FeedbackOne";
import BlogOne from "@/components/containers/blog/BlogOne";

const Home = () => {
  return (
    <Layout header={1} footer={1}>
      <HomeBannerOne />
      <SponsorOne />
      <ChooseOne />
      <AboutOne />
      <FeaturesOne />
      {/*<SoftwareOne />*/}
      <ProjectOne />
      <WorkOne />
      {/*<FeedbackOne />*/}
      <BlogOne />
    </Layout>
  );
};

export default Home;
