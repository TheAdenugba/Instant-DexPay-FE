import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={10}
        height={10}
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M5 4.046 8.34.706l.955.954L5.954 5l3.342 3.342-.955.954L5 5.956l-3.341 3.34-.955-.954 3.341-3.341L.705 1.66l.954-.955z"
            fill="#D0D5DD"
        />
    </svg>
);
export default SVGComponent;
