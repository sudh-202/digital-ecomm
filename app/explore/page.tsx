// import { featuredItems } from '@/constant';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ExplorePage() {
  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Explore All Items</h1>
      
      {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredItems.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden relative">
                    <Image
                      src={item.authorImage}
                      alt={item.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-gray-600">{item.author}</span>
                </div>
                <span className="text-2xl font-bold text-yellow-400">${item.price}</span>
              </div>
              <Button className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500">
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div> */}
    </main>
  );
}
