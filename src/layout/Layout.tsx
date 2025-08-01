import React from "react";
import Navigation from "../components/Navigation";
import Footer from "./Footer";
import { ComponentProps } from "../interfaces";

const Layout: React.FC<ComponentProps> = ({ children }) => {
  return (
    <div>
      <Navigation />
      <main className="min-h-full">{children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
