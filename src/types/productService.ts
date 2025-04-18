export type ProductImage = {
    url: string;
    index: number;
};

export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    store_id: number;
    category_id: number;
    rating: number;
    sell_count: number;
    images: ProductImage[];
};

export type ProductResponse = {
    products: Product[];
    total: number;
};

export type QueryParams = {
    sort: string;
    limit: number;
    offset: number;
};