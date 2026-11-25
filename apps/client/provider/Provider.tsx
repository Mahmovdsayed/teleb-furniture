'use client'

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "@teleb/ui/components/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@teleb/ui/components/tooltip";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
        if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
            return;
        }
        originalError.apply(console, args);
    };
}

interface IProps {
    children: React.ReactNode
}

const Provider = ({ children }: IProps) => {
    const [queryClient] = useState(() => new QueryClient());
    return <>
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider
                enableSystem
                defaultTheme="system"
                disableTransitionOnChange
                storageKey="teleb_theme"
                attribute="class"
            >
                <Toaster timeout={5000} />
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </NextThemesProvider>
        </QueryClientProvider>
    </>;
};

export default Provider;