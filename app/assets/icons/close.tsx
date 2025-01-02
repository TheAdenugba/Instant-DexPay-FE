import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={12}
        height={12}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M6 4.725 10.455.27l1.272 1.272-4.455 4.455 4.455 4.455-1.272 1.273L6 7.27l-4.455 4.455-1.273-1.273 4.455-4.455L.272 1.542 1.545.27z"
            fill="#D0D5DD"
        />
    </svg>
);
export default SVGComponent;
