import ScrollRig from "@/components/ScrollRig";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { Difference } from "@/components/Difference";
import { Result } from "@/components/Result";
import { Promise } from "@/components/Promise";
import { Services } from "@/components/Services";
import { Journey } from "@/components/Journey";
import { Work } from "@/components/Work";
import Pricing from "@/components/Pricing";
import Risk from "@/components/Risk";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollRig />
      <Nav />
      <main>
        <Hero />
        <Difference />
        <Result />
        <Promise />
        <Services />
        <Journey />
        <Work />
        <Pricing />
        <Risk />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
