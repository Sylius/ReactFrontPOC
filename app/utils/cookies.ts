import { createCookie } from "@remix-run/node";

export const orderTokenCookie = createCookie("orderToken", {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
});
