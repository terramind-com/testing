export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  category: string;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
}

const products: Map<string, Product> = new Map();

export function getProduct(id: string): Product | undefined {
  return products.get(id);
}

export function listProducts(filters?: { category?: string; active?: boolean }): Product[] {
  let result = Array.from(products.values());
  if (filters?.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters?.active !== undefined) {
    result = result.filter((p) => p.isActive === filters.active);
  }
  return result;
}

export function createProduct(data: Omit<Product, "id" | "createdAt">): Product {
  const product: Product = {
    ...data,
    id: `prod_${Date.now()}`,
    createdAt: new Date(),
  };
  products.set(product.id, product);
  return product;
}

export function updateStock(id: string, quantity: number): Product | null {
  const product = products.get(id);
  if (!product) return null;

  product.stock += quantity;
  return product;
}
