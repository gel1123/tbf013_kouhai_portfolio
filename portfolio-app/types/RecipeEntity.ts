export type RecipeEntity = {
  name: string;
  items: {
    name: string;
    amount: number | null;
    unit: string;
  }[];
  howToCook: string;
};
