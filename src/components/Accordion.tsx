import React from "react";

interface AccordionItem {
    title: string;
    content: React.ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
}

const BootstrapAccordion: React.FC<AccordionProps> = ({ items }) => {
    return (
        <div className="accordion accordion-flat" id="productAccordion">
            {items.map((item, index) => (
                <div className="accordion-item rounded-0" key={index}>
                    <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                            className={`accordion-button px-0 ${index === 0 ? "" : "collapsed"}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${index}`}
                            aria-expanded={index === 0 ? "true" : "false"}
                            aria-controls={`collapse${index}`}
                        >
                            <span className='h5 mb-0 py-2'>{item.title}</span>
                        </button>
                    </h2>
                    <div
                        id={`collapse${index}`}
                        className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#productAccordion"
                    >
                        <div className="accordion-body px-0 pt-2 pb-4">{item.content}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BootstrapAccordion;
