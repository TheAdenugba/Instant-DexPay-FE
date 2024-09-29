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
            d="M31.2 33h-1.8v-1.8a2.7 2.7 0 0 0-2.7-2.7h-5.4a2.7 2.7 0 0 0-2.7 2.7V33h-1.8v-1.8a4.5 4.5 0 0 1 4.5-4.5h5.4a4.5 4.5 0 0 1 4.5 4.5zM24 24.9a5.402 5.402 0 0 1-4.99-7.467A5.4 5.4 0 1 1 24 24.9m0-1.8a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2"
            fill="#D0D5DD"
        />
    </svg>
);
export default SVGComponent;
