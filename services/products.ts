import { getAll, getById, add, update, remove, Product } from './database';

export { Product };

export const getProducts = async (searchQuery?: string): Promise<Product[]> => {
  const products = getAll<Product>('products');
  if (searchQuery) {
    return products.filter(
      (p) => p.name.includes(searchQuery) || p.category.includes(searchQuery) || p.description.includes(searchQuery)
    );
  }
  return products.sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getProductById = async (id: number): Promise<Product | null> => {
  return getById<Product>('products', id) || null;
};

export const addProduct = async (product: Product): Promise<number> => {
  return add('products', product);
};

export const updateProduct = async (id: number, updates: Partial<Product>): Promise<void> => {
  await update('products', id, updates);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await remove('products', id);
};

export const getProductCategories = async (): Promise<string[]> => {
  const products = getAll<Product>('products');
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories);
};
