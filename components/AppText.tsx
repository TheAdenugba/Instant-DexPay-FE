import React from 'react'

type Props = {
    text: string;
} & React.HTMLAttributes<HTMLDivElement>

const AppText = ({ text, className, ...rest }: Props) => {
    return (
        <div className={className} {...rest}>{text}</div>
    )
}

export default AppText