"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price?: number;
    slug: string;
    images?: string[] | null;
    category?: { id: string; name: string } | null;
    description?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  // const imageSrc = product.images?.[0] || "/placeholder.jpg";
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
      {/* Product Image */}
      <Image
        src={
          product.images?.[0]
            ? product.images[0].startsWith("http")
              ? product.images[0]
              : "/" + product.images[0]  
            : "/placeholder.png" 
        }
        alt={product.name}
        width={400}
        height={200}
        className="w-[400] h-[200]"
      />

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-1 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description || "No description available."}
        </p>
        <p className="text-gray-500 text-sm mb-1">
          Category: {product.category?.name || "Uncategorized"}
        </p>
        <p className="text-primary font-semibold mt-auto text-base sm:text-lg">
          ${product.price?.toFixed(2) || "0.00"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center p-3 border-t text-sm sm:text-base">
        <button
          onClick={() => router.push(`/products/${product.slug || product.id}`)}
          className="text-primary hover:text-blue-600"
          title="View Details"
        >
          View Details
        </button>
        <button
          onClick={() => alert("Delete logic here")}
          className="text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <Trash size={18} /> Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
