import Ticker from "@/components/home/Ticker";
import Nav from "@/components/home/Nav";
import Footer from "@/components/home/Footer";
import AskFieldSync from "@/components/home/AskFieldSync";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Ticker />
      <Nav />
      <main className="relative z-[10]">{children}</main>
      <Footer />
      <AskFieldSync />
    </>
  );
}
