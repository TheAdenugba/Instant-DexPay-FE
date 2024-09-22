import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M4.078 3.46a6 6 0 0 1 8.836 7.984L11 8h1.8a4.8 4.8 0 0 0-8.124-3.463zm7.844 9.08a6 6 0 0 1-8.836-7.984L5 8H3.2a4.8 4.8 0 0 0 8.124 3.463z"
            fill="#fff"
        />
    </svg>
);
export default SVGComponent;
