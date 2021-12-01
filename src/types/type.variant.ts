import { Media } from "../entities/media";

export type VariantResponse = {
  id?: number;
  price?: number;
  comparePrice?: number;
  availableNumber?: number;
  featureImageId?: number;
  productId?: number;
  featureImage?: Media;
  available?: boolean;
  option1?: string;
  option2?: string;
  option3?: string;
  options?: string[];
  name?: string;
  publicTitle?: string;
};
