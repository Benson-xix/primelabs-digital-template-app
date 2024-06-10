// types.ts
export interface Review {
    id: string;
    rating: number;
    comment: string;
    user: string | {
      id: string;
      createdAt: string;
      updatedAt: string;
      email: string;
      password: string | null;
      products?: (string | {
        id: string;
        product_files: string | {
        };
      })[] | null | undefined;
    };
  }
  