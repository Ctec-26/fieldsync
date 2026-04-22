import HoloBackground from "@/components/home/HoloBackground";
import Hero from "@/components/home/Hero";
import Dashboard from "@/components/home/Dashboard";
import Trending from "@/components/home/Trending";
import Discovery from "@/components/home/Discovery";
import LiveFeed from "@/components/home/LiveFeed";
import BlockBrainPreview from "@/components/home/BlockBrainPreview";
import Builders from "@/components/home/Builders";

export default function HomePage() {
  return (
    <>
      <HoloBackground />
      <Hero />
      <Dashboard />
      <Trending />
      <Discovery />
      <LiveFeed />
      <BlockBrainPreview />
      <Builders />
    </>
  );
}
