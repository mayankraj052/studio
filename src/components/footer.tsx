import React from "react";

export function Footer() {
  return (
    <footer className="py-6 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ReelGenius. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}