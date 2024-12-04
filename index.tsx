import React, { useState, useLayoutEffect } from "react";

type Tunnel = {
  callbacks: Set<(node: React.ReactNode) => void>;
  activeSource: boolean;
};

export function createTunnel(): Tunnel {
  return {
    callbacks: new Set(),
    activeSource: false,
  };
}

interface InTunnelProps {
  tunnel: Tunnel;
  children: React.ReactNode;
}

export function InTunnel({ tunnel, children }: InTunnelProps): React.ReactNode {
  useLayoutEffect(() => {
    if (tunnel.activeSource) {
      throw new Error("Multiple InTunnels detected for the same tunnel");
    }
    tunnel.activeSource = true;
    tunnel.callbacks.forEach((callback) => callback(children));

    return () => {
      tunnel.activeSource = false;
      tunnel.callbacks.forEach((callback) => callback(null));
    };
  }, [tunnel, children]);

  return null;
}

interface OutTunnelProps {
  tunnel: Tunnel;
}

export function OutTunnel({ tunnel }: OutTunnelProps): JSX.Element {
  const [content, setContent] = useState<React.ReactNode>(null);

  useLayoutEffect(() => {
    const callback = (node: React.ReactNode) => setContent(node);
    tunnel.callbacks.add(callback);
    return () => {
      tunnel.callbacks.delete(callback);
    };
  }, [tunnel]);

  return <>{content}</>;
}
