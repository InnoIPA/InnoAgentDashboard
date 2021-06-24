import "jquery-easy-loading";

export const pageLoadingAnimate = ({ DOMElement, type }) => {

    // If DOM element is 
    if (DOMElement === undefined || DOMElement === null) {
        DOMElement = "#container";
    }

    switch (type) {
        // Loading
        case "loading": {
            $(DOMElement).loading({
                theme: "light",
            });
            break;
        }

        // Processing
        case "processing": {
            $(DOMElement).loading({
                theme: "light",
                message: "Processing ... "
            });
            break;
        }

        // Stop
        case "stop": {
            $(DOMElement).loading("stop");
            break;
        }
        default: {
            $(DOMElement).loading({
                theme: "light",
            });
            break;
        }
    }
};