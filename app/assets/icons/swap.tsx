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
            d="m7.97 5.57-.848.848L5.6 4.896V12.8H4.4V4.896L2.879 6.418 2.03 5.57 5 2.6zm6 4.86L11 13.4l-2.97-2.97.848-.849 1.523 1.522L10.4 3.2h1.2v7.903l1.522-1.522z"
            fill="#fff"
        />
    </svg>
);
export default SVGComponent;
