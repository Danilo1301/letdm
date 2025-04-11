import { ProductJSON } from "./Product";
import { ThemeJSON } from "./Theme";

export interface ChamadaJSON_HomeList {
    id: string;
    numProducts: number;
    date: number;
    completed: boolean;
    theme: ThemeJSON;
}

export interface ProductJSON_Search {
    product: ProductJSON;
    date: number;
}