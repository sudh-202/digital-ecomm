import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";

export default function Home() {
  return (
    <main className="bg-black">
      <Hero />
      {/* <LogoSlider /> */}
      {/* <Categories /> */}
      <ProductList />
    </main>
  );
}
