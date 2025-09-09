import Layout from "@/layout/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FavoritesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </FavoritesProvider>
  );
}
