export interface Customer {
  defaultAddress?: string | null;
  user?: { verified?: boolean } | null;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  birthday?: string | null;
  gender?: string;
  phoneNumber?: string | null;
  subscribedToNewsletter?: boolean;
  fullName?: string;
}
