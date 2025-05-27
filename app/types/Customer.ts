export interface ShopUser {
  "@id": string;
  "@type": string;
  verified: boolean;
}

export interface Customer {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;
  defaultAddress?: string | { "@id": string } | null;
  user?: ShopUser | null;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  birthday?: string | null;
  gender?: string;
  phoneNumber?: string | null;
  subscribedToNewsletter?: boolean;
  fullName?: string;
}
