import React from 'react'

const DashboardMenuLink = ({ svgLink, title, href, isFull}: { svgLink: string, title: string, href: string, isFull: boolean }) => (
        <a className={isFull ? "" : "tooltip tooltip-right"} data-tip={title} href={href}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={svgLink}
                />
            </svg>
            {isFull ? title : ""}
        </a>
    )

export default DashboardMenuLink