import { store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { Provider } from "react-redux";

const queryClient = new QueryClient();
export const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                {children}
            </Provider>
        </QueryClientProvider>
    )
}