import { ScrollViewStyleReset } from "expo-router/html";
import React from "react";

// This file is used to configure the html rendering for the web version of the app

export default function Root({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, viewport-fit=cover"
                />
                <title>GearConnect</title>
                <meta
                    name="description"
                    content="GearConnect - Connect with professionals"
                />
                {/* Reset the scroll view styles */}
                <ScrollViewStyleReset />
            </head>
            <body>{children}</body>
        </html>
    );
}
 