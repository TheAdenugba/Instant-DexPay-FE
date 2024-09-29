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
            d="M15 31.2h18V33H15zm1.8-7.2h1.8v6.3h-1.8zm4.5 0h1.8v6.3h-1.8zm3.6 0h1.8v6.3h-1.8zm4.5 0h1.8v6.3h-1.8zM15 19.5l9-4.5 9 4.5v3.6H15zm1.8 1.112v.688h14.4v-.688l-7.2-3.6zM24 20.4a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8"
            fill="#D0D5DD"
        />
    </svg>
);
export default SVGComponent;
