export interface ProductTaxon {
    taxon: string; // URL do taxonu np. "/api/v2/shop/taxons/caps"
}

export interface Taxon {
    id: number;
    name: string;
    code: string;
    slug: string;
    description: string;
    children: string[];
}
export interface TaxonChild {
    id: number;
    name: string;
    slug: string;
}
