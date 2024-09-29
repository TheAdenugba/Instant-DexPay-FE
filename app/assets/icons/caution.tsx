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
            d="M8 15.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12m-.75-9.75h1.5v1.5h-1.5zm0 3h1.5v4.5h-1.5z"
            fill="#F79009"
        />
    </svg>
);
export default SVGComponent;
