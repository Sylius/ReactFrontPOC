import React from 'react';

interface Props {
    onClose: () => void;
}

const AddToCartConfirmation: React.FC<Props> = ({ onClose }) => {
    return (
        <div
            className="alert alert-success alert-dismissible fade show mt-3"
            role="alert"
        >
            The product has been added to your cart!
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
            ></button>
        </div>
    );
};

export default AddToCartConfirmation;
