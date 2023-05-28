"use client";

import { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface providersProps {
    children: ReactNode
}

const Providers: FC<providersProps> = ({ children }) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </>
  );
};

export default Providers;
