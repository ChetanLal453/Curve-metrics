import React from "react";
import Image from "next/image";
import Link from "next/link";

// Sections
import WhySeoMatters from "@/components/containers/about/AboutMatters";
import OurSeoServices from "@/components/containers/service/HomeFourService";
import SeoProcess from "@/components/containers/details/Process";
import WhyChooseUs from "@/components/containers/Choose/ChooseTwo";
import FaqSection from "@/components/containers/faq/FaqSection";
import CallToAction from "@/components/containers/cta/CallToAction";

import Banner from "@/components/layout/banner/Banner";
import Layout from "@/components/layout/Layout";

const SeoPage = () => {
  return (
    <Layout header={5} footer={5}>
      {/* Hero Section */}
      <Banner title="SEO Services That Drive Real Results" />

      {/* Why SEO Matters */}
      <WhySeoMatters />

      {/* Our SEO Services */}
      <OurSeoServices />

      {/* Our Process */}
      <SeoProcess />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* FAQ Section */}
      <FaqSection />

      {/* Call to Action */}
      <CallToAction />
    </Layout>
  );
};

export default SeoPage;
