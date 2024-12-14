import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";

export default function Home() {
  return (
    <main className="dark:bg-[#111827] bg-[#F9FAFB]">
      <Hero />
      {/* <LogoSlider /> */}
      {/* <Categories /> */}
      <ProductList />
    </main>
  );
}
