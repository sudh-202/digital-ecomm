"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFileIcon } from "@/lib/utils/file-icons";
import {
  MoreHorizontal,
  Plus,
  FileImage,
  Pencil,
  Trash2,
  Eye,
  Search,
  Package,
  FileBox,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  mobileImage?: string;
  desktopImage?: string;
  attachments?: {
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  createdAt: string;
  slug: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch products");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const totalImages = products.reduce((acc, product) => {
    let count = 0;
    if (product.image) count++;
    if (product.mobileImage) count++;
    if (product.desktopImage) count++;
    return acc + count;
  }, 0);
  const totalAssets = products.reduce(
    (acc, product) => acc + (product.attachments?.length || 0),
    0
  );

  return (
    <div className="container mx-auto py-8 space-y-8 pt-24">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Products Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your products, images, and digital assets in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer group relative"
          onClick={() => router.push('/dashboard/products')}
        >
          <div className="flex items-center justify-between space-x-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Products</div>
              <div className="text-2xl font-bold">{products.length}</div>
              <div className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view all products
              </div>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Package className="h-6 w-6 text-blue-700 dark:text-blue-300" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        </Card>

        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer group relative"
          onClick={() => {
            toast.info(`${totalImages} images across ${products.length} products`)
          }}
        >
          <div className="flex items-center justify-between space-x-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Images</div>
              <div className="text-2xl font-bold">{totalImages}</div>
              <div className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click for image details
              </div>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
              <ImageIcon className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        </Card>

        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer group relative"
          onClick={() => {
            toast.info(`${totalAssets} assets across ${products.length} products`)
          }}
        >
          <div className="flex items-center justify-between space-x-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Assets</div>
              <div className="text-2xl font-bold">{totalAssets}</div>
              <div className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click for asset details
              </div>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <FileText className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        <Button onClick={() => router.push("/dashboard/products/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Product</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Package className="h-8 w-8 mb-2" />
                    <p>No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {product.image ? (
                        <div className="relative h-10 w-10 rounded-md overflow-hidden border dark:border-gray-800">
                          <Image
                            src={product.image.startsWith('/') ? product.image : `/${product.image}`}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.image && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          <FileImage className="h-3 w-3 mr-1" />
                          Main
                        </Badge>
                      )}
                      {product.mobileImage && (
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                          <FileImage className="h-3 w-3 mr-1" />
                          Mobile
                        </Badge>
                      )}
                      {product.desktopImage && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          <FileImage className="h-3 w-3 mr-1" />
                          Desktop
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.attachments?.map((file, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-500/10"
                        >
                          {React.createElement(getFileIcon(file.name), {
                            className: "h-3 w-3 mr-1",
                          })}
                          <span className="max-w-[100px] truncate">
                            {file.name}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-orange-500/10 text-orange-500"
                    >
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${product.price}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-muted"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => router.push(`/products/${product.slug}`)}
                          className="text-blue-500"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/products/${product.id}/edit`)
                          }
                          className="text-orange-500"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
