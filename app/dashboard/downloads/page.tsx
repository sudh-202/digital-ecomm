"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { usePurchased } from "@/context/purchased-context";
import { useEffect, useState } from "react";

interface DownloadItem {
  id: string;
  name: string;
  description: string;
  downloadUrl: string;
  purchaseDate: string;
}

export default function DownloadsPage() {
  const { purchasedItems } = usePurchased();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = (item: DownloadItem) => {
    // In a real application, this would trigger a secure download
    toast.success(`Starting download: ${item.name}`);
    
    // Simulate download start
    setTimeout(() => {
      window.open(item.downloadUrl, "_blank");
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Your Downloads</h1>
        
        {purchasedItems.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-8">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>No downloads available yet.</p>
                <p className="mt-2">Complete a purchase to see your downloads here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {purchasedItems.map((item) => (
              <Card key={item.id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold dark:text-white">{item.name}</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Purchased on {new Date(item.purchaseDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleDownload(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
