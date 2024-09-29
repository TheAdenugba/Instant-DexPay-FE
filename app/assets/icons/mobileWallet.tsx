import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={48}
        height={48}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect x={0.5} y={0.5} width={47} height={47} rx={23.5} fill="#344054" />
        <rect x={0.5} y={0.5} width={47} height={47} rx={23.5} stroke="#344054" />
        <path
            d="M33 19.5h.9v9H33v2.7a.9.9 0 0 1-.9.9H15.9a.9.9 0 0 1-.9-.9V16.8a.9.9 0 0 1 .9-.9h16.2a.9.9 0 0 1 .9.9zm-1.8 9h-5.4a4.5 4.5 0 1 1 0-9h5.4v-1.8H16.8v12.6h14.4zm.9-1.8v-5.4h-6.3a2.7 2.7 0 0 0 0 5.4zm-6.3-3.6h2.7v1.8h-2.7z"
            fill="#D0D5DD"
        />
    </svg>
);
export default SVGComponent;
