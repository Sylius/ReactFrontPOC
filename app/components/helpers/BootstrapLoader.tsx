import { useEffect } from "react";

export const BootstrapLoader = () => {
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.js");
    }, []);

    return null;
};
