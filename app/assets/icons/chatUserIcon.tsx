import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect width={40} height={40} rx={20} fill="#FC3F6B" />
        <g filter="url(#a)">
            <g clipPath="url(#b)">
                <rect width={40} height={40} rx={20} fill="#FC3F6B" />
                <g filter="url(#c)" shapeRendering="crispEdges">
                    <ellipse cx={20} cy={38} rx={16} ry={12} fill="url(#d)" />
                    <path
                        d="M35.5 38c0 3.121-1.686 5.985-4.486 8.085C28.213 48.185 24.32 49.5 20 49.5s-8.213-1.314-11.014-3.415C6.186 43.985 4.5 41.121 4.5 38s1.686-5.985 4.486-8.085C11.787 27.815 15.68 26.5 20 26.5s8.213 1.314 11.014 3.415c2.8 2.1 4.486 4.964 4.486 8.085Z"
                        stroke="url(#e)"
                    />
                </g>
                <g filter="url(#f)" shapeRendering="crispEdges">
                    <circle cx={20} cy={16} r={8} fill="url(#g)" />
                    <circle cx={20} cy={16} r={7.5} stroke="url(#h)" />
                </g>
            </g>
        </g>
        <defs>
            <radialGradient
                id="d"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(0 24 -32 0 20 26)"
            >
                <stop stopColor="#fff" />
                <stop offset={1} stopColor="#fff" stopOpacity={0} />
            </radialGradient>
            <radialGradient
                id="e"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(0 24 -32 0 20 26)"
            >
                <stop stopColor="#fff" />
                <stop offset={1} stopColor="#fff" stopOpacity={0} />
            </radialGradient>
            <radialGradient
                id="g"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(0 16 -16 0 20 8)"
            >
                <stop stopColor="#fff" />
                <stop offset={1} stopColor="#fff" stopOpacity={0} />
            </radialGradient>
            <radialGradient
                id="h"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(0 16 -16 0 20 8)"
            >
                <stop stopColor="#fff" />
                <stop offset={1} stopColor="#fff" stopOpacity={0} />
            </radialGradient>
            <filter
                id="a"
                x={0}
                y={-8}
                width={40}
                height={48}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy={-8} />
                <feGaussianBlur stdDeviation={8} />
                <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <feColorMatrix values="0 0 0 0 0.988235 0 0 0 0 0.247059 0 0 0 0 0.419608 0 0 0 0.23 0" />
                <feBlend in2="shape" result="effect1_innerShadow_2892_41599" />
            </filter>
            <filter
                id="c"
                x={0}
                y={18}
                width={40}
                height={40}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy={4} />
                <feGaussianBlur stdDeviation={2} />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0.541176 0 0 0 0 0.560784 0 0 0 0 0.576471 0 0 0 0.16 0" />
                <feBlend
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_2892_41599"
                />
                <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_2892_41599"
                    result="shape"
                />
                <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy={-8} />
                <feGaussianBlur stdDeviation={4} />
                <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                <feBlend in2="shape" result="effect2_innerShadow_2892_41599" />
            </filter>
            <filter
                id="f"
                x={8}
                y={0}
                width={24}
                height={32}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy={4} />
                <feGaussianBlur stdDeviation={2} />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0.541176 0 0 0 0 0.560784 0 0 0 0 0.576471 0 0 0 0.16 0" />
                <feBlend
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_2892_41599"
                />
                <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_2892_41599"
                    result="shape"
                />
                <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                />
                <feOffset dy={-8} />
                <feGaussianBlur stdDeviation={4} />
                <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                <feBlend in2="shape" result="effect2_innerShadow_2892_41599" />
            </filter>
            <clipPath id="b">
                <rect width={40} height={40} rx={20} fill="#fff" />
            </clipPath>
        </defs>
    </svg>
);
export default SVGComponent;
