import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#a)">
            <path
                d="M0 20V0h10a10.02 10.02 0 0 1 6.953 2.998 9.995 9.995 0 0 1 0 14.004A10.02 10.02 0 0 1 10 20z"
                fill="#F41449"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="m10 5.73 3.702 2.137v1.878h2.028l.97-1.656h2.207l1.105 1.91-1.117 1.914H16.7l-.958-1.656h-2.028v1.878l-3.702 2.132-3.702-2.132v-1.878H4.282l-.966 1.656h-2.21L0 9.999l1.105-1.91h2.211l.954 1.656h2.028V7.867z"
                fill="#fff"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h20v20H0z" />
            </clipPath>
        </defs>
    </svg>
);
export default SVGComponent;
