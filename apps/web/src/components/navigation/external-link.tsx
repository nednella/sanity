import React from "react";

type ExternalLinkProps = Omit<React.ComponentPropsWithRef<"a">, "rel" | "target">;

export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  return (
    <a
      {...props}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
