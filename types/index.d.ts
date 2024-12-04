import React from "react";
type Tunnel = {
    callbacks: Set<(node: React.ReactNode) => void>;
    activeSource: boolean;
};
export declare function createTunnel(): Tunnel;
interface InTunnelProps {
    tunnel: Tunnel;
    children: React.ReactNode;
}
export declare function InTunnel({ tunnel, children }: InTunnelProps): React.ReactNode;
interface OutTunnelProps {
    tunnel: Tunnel;
}
export declare function OutTunnel({ tunnel }: OutTunnelProps): JSX.Element;
export {};
