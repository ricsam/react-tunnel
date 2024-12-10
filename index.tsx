import { useState, useLayoutEffect } from "react";
import type { ReactNode } from "react";

export type Tunnel = {
  callbacks: Set<(node: ReactNode) => void>;
  activeSource: boolean;
};

/**
 * Creates a new tunnel instance that can be used to transport React components
 * from one location in the component tree to another.
 *
 * @returns {Tunnel} A new tunnel instance
 * @example
 * const tunnel = createTunnel();
 */
export function createTunnel(): Tunnel {
  return {
    callbacks: new Set(),
    activeSource: false,
  };
}

interface InTunnelProps {
  tunnel: Tunnel;
  children: ReactNode;
}

/**
 * Sends React components through a tunnel to be rendered at an OutTunnel location.
 * Only one InTunnel is allowed per tunnel instance.
 *
 * @throws {Error} If multiple InTunnels are used with the same tunnel
 * @param {InTunnelProps} props - Props containing the tunnel and children to transport
 * @returns null - The children are rendered at the OutTunnel location
 * @example
 * <InTunnel tunnel={tunnel}>
 *   <div>This content will be moved</div>
 * </InTunnel>
 */
export function InTunnel({ tunnel, children }: InTunnelProps): ReactNode {
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

/**
 * Renders content that was sent through a tunnel via InTunnel.
 * Multiple OutTunnels can share the same tunnel and will render identical content.
 *
 * @param {OutTunnelProps} props - Props containing the tunnel to receive content from
 * @returns The content sent through the tunnel, or null if no content is available
 * @example
 * <OutTunnel tunnel={tunnel} />
 */
export function OutTunnel({ tunnel }: OutTunnelProps): JSX.Element {
  const [content, setContent] = useState<ReactNode>(null);

  useLayoutEffect(() => {
    const callback = (node: ReactNode) => setContent(node);
    tunnel.callbacks.add(callback);
    return () => {
      tunnel.callbacks.delete(callback);
    };
  }, [tunnel]);

  return <>{content}</>;
}

//#region OPTIONAL EXTRA UTILS

/**
 * Returns true if an InTunnel is currently rendering a visible ReactNode for the given tunnel.
 *
 * @param {Tunnel} tunnel - The tunnel instance
 * @returns {boolean} True if an InTunnel is currently rendering a visible ReactNode
 */
export function useTunnelIsOpen(tunnel: Tunnel): boolean {
  const [open, setOpen] = useState<boolean>(false);

  useLayoutEffect(() => {
    const callback = (node: ReactNode) => {
      return setOpen(Boolean(node));
    };
    tunnel.callbacks.add(callback);
    return () => {
      tunnel.callbacks.delete(callback);
    };
  }, [tunnel]);

  return open;
}

//#endregion
