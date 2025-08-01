import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ComponentProps } from "../interfaces";

const Layout: React.FC<ComponentProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="min-h-full">{children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
