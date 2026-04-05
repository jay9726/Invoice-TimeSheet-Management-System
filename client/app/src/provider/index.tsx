import { store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "./theme-provider";

const queryClient = new QueryClient();
export const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <Provider store={store}>
                    {children}
                </Provider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}