import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={13}
        height={13}
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M3.95 1.848v1.05H1.325v5.775H7.1V6.048h1.05v3.15a.525.525 0 0 1-.525.525H.8a.525.525 0 0 1-.525-.525V2.373A.525.525 0 0 1 .8 1.848zM9.725.273v4.2h-1.05V2.065l-4.09 4.092-.743-.742 4.09-4.092H5.526V.273z"
            fill="#667085"
        />
    </svg>
);
export default SVGComponent;
