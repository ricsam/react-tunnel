import { render, act } from "@testing-library/react";
import { createTunnel, InTunnel, OutTunnel } from "./index";
import { describe, it, expect, spyOn } from "bun:test";

describe("Tunnel", () => {
  it("renders content through the tunnel", () => {
    const tunnel = createTunnel();
    const { getByText } = render(
      <>
        <OutTunnel tunnel={tunnel} />
        <InTunnel tunnel={tunnel}>
          <div>Tunneled content</div>
        </InTunnel>
      </>,
    );

    expect(getByText("Tunneled content")).toBeInTheDocument();
  });

  it("throws error when multiple InTunnels are used", () => {
    const tunnel = createTunnel();
    const consoleError = spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(
        <>
          <InTunnel tunnel={tunnel}>
            <div>Content 1</div>
          </InTunnel>
          <InTunnel tunnel={tunnel}>
            <div>Content 2</div>
          </InTunnel>
        </>,
      );
    }).toThrow("Multiple InTunnels detected");

    consoleError.mockRestore();
  });

  it("updates content when children change", () => {
    const tunnel = createTunnel();
    const { getByText, rerender } = render(
      <>
        <OutTunnel tunnel={tunnel} />
        <InTunnel tunnel={tunnel}>
          <div>Initial content</div>
        </InTunnel>
      </>,
    );

    expect(getByText("Initial content")).toBeInTheDocument();

    rerender(
      <>
        <OutTunnel tunnel={tunnel} />
        <InTunnel tunnel={tunnel}>
          <div>Updated content</div>
        </InTunnel>
      </>,
    );

    expect(getByText("Updated content")).toBeInTheDocument();
  });

  it("removes content when InTunnel unmounts", () => {
    const tunnel = createTunnel();
    const { getByText, container, unmount } = render(
      <>
        <OutTunnel tunnel={tunnel} />
        <InTunnel tunnel={tunnel}>
          <div>Content</div>
        </InTunnel>
      </>,
    );

    expect(getByText("Content")).toBeInTheDocument();

    act(() => {
      unmount();
    });

    expect(container.innerHTML).toBe("");
  });

  it("supports multiple OutTunnels", () => {
    const tunnel = createTunnel();
    const { getAllByText } = render(
      <>
        <OutTunnel tunnel={tunnel} />
        <OutTunnel tunnel={tunnel} />
        <InTunnel tunnel={tunnel}>
          <div>Content</div>
        </InTunnel>
      </>,
    );

    expect(getAllByText("Content")).toHaveLength(2);
  });
});
