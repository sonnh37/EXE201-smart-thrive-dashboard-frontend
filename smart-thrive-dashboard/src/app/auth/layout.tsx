// app/auth/AuthLayout.tsx

import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div >
      <div >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;