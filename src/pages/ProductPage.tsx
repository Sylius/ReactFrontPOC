import React from "react";

const ProductPage: React.FC = () => {
    // Dane przykładowego produktu
    const product = {
        id: 1,
        name: "Bezprzewodowe Słuchawki",
        description: "Wysokiej jakości słuchawki bezprzewodowe z dźwiękiem Hi-Fi i długim czasem pracy na baterii.",
        price: 299.99,
        imageUrl: "https://placehold.co/600x400",
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
                <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-md" />
                <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="text-xl font-semibold mt-4 text-green-600">${product.price}</p>
                <button className="mt-6 w-full px-6 py-2 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition">
                    Dodaj do koszyka
                </button>
            </div>
        </div>
    );
};

export default ProductPage;
