import React from "react";
type Tunnel = {
    callbacks: Set<(node: React.ReactNode) => void>;
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
export declare function createTunnel(): Tunnel;
interface InTunnelProps {
    tunnel: Tunnel;
    children: React.ReactNode;
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
export declare function InTunnel({ tunnel, children }: InTunnelProps): React.ReactNode;
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
export declare function OutTunnel({ tunnel }: OutTunnelProps): JSX.Element;
export {};
