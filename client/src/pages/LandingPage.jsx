import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Capabilities from "../components/landing/Capabilities";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <main className="hero-gradient">
        <Hero />
        <Capabilities />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
