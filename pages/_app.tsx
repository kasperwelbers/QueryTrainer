import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Inter } from "next/font/google";

const font = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  );
}
