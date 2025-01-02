import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={20}
        height={20}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M4 7a1 1 0 0 1 1-1h19a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m0 7a1 1 0 0 1 1-1h11a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m1 6a1 1 0 1 0 0 2h17a1 1 0 1 0 0-2z"
            fill="#fff"
        />
    </svg>
);
export default SVGComponent;
