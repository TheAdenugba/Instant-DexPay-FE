import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={21}
        height={20}
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M3.75 3.75h13.5a.75.75 0 0 1 .75.75v11a.75.75 0 0 1-.75.75H3.75A.75.75 0 0 1 3 15.5v-11a.75.75 0 0 1 .75-.75M16.5 6.928l-5.946 5.326L4.5 6.912v7.838h12zM4.883 5.25l5.663 4.996 5.58-4.996z"
            fill="#fff"
        />
    </svg>
);
export default SVGComponent;
