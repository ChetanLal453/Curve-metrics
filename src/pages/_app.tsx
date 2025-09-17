import React, { Suspense, useEffect } from "react";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

import "public/app/css/fontawesome-pro.css";
import "@/styles/index-four.scss";
import "@/styles/main.scss";

import AOS from "aos";
import "aos/dist/aos.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Suspense>
      <Component {...pageProps} />
    </Suspense>
  );
}
