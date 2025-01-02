import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={11}
        height={12}
        viewBox="0 0 11 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M4.75 5.25V0.75H6.25V5.25H10.75V6.75H6.25V11.25H4.75V6.75H0.25V5.25H4.75Z"
            fill="white"
        />
    </svg>
);
export default SVGComponent;
