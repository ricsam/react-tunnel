# @ricsam/react-tunnel

This package allows you to define where you want components to end up in the react component hierarchy. It is like a managed react portal. This is useful if you are dealing with contexts or different React renderers like react-three-fiber or react-art. The code is quite simple, so instead of installing this package from npm you can just copy the code from [index.tsx](./index.tsx) and use it in your project.

```sh
npm i @ricsam/react-tunnel
```

## Usage

```tsx
import { createTunnel, InTunnel, OutTunnel } from "@ricsam/react-tunnel";

// Create a tunnel instance
const tunnel = createTunnel();

// In your layout component
function Layout() {
  return (
    <div>
      <h1>Header</h1>
      <OutTunnel tunnel={tunnel} /> {/* Content will appear here */}
      <div>Other content</div>
    </div>
  );
}

// Deep in your component tree
function DeepComponent() {
  return (
    <div>
      <h2>Deep component</h2>
      <InTunnel tunnel={tunnel}>
        <div>This content will appear after Header</div>
      </InTunnel>
    </div>
  );
}
```

## Examples

### Modal Portal

```tsx
const modalTunnel = createTunnel();

function App() {
  return (
    <div>
      <OutTunnel tunnel={modalTunnel} />
      <PageContent />
    </div>
  );
}

function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  return (
    <InTunnel tunnel={modalTunnel}>
      <div className="modal">{children}</div>
    </InTunnel>
  );
}
```

### Multiple Targets

```tsx
const primaryTunnel = createTunnel();
const secondaryTunnel = createTunnel();

function Layout() {
  return (
    <div>
      <nav>
        <OutTunnel tunnel={primaryTunnel} />
      </nav>
      <aside>
        <OutTunnel tunnel={secondaryTunnel} />
      </aside>
    </div>
  );
}

function Feature() {
  return (
    <>
      <InTunnel tunnel={primaryTunnel}>
        <PrimaryNavContent />
      </InTunnel>
      <InTunnel tunnel={secondaryTunnel}>
        <SidebarContent />
      </InTunnel>
    </>
  );
}
```

### Dynamic Tunnels

```tsx
const TunnelContext = createContext<Tunnel>(createTunnel());
function useTunnel() {
  return useContext(TunnelContext);
}

// Use tunnels in your app
function App() {
  const tunnel = useMemo(createTunnel, []);
  return (
    <TunnelContext.Provider value={tunnel}>
      <OutTunnel tunnel={useTunnel().modal} />
      <Content />
    </TunnelContext.Provider>
  );
}

// Consume tunnel anywhere
function Content() {
  const tunnel = useTunnel();
  return (
    <InTunnel tunnel={tunnel}>
      <div>This appears at OutTunnel</div>
    </InTunnel>
  );
}
```

## API

### `createTunnel()`

Creates a new tunnel instance.

### `<InTunnel tunnel={tunnel}>`

Sends children to the corresponding OutTunnel. Only one InTunnel is allowed per tunnel.

### `<OutTunnel tunnel={tunnel}>`

Renders content from the corresponding InTunnel. Multiple OutTunnels can share the same tunnel.

## Restrictions

- Only one InTunnel is allowed per tunnel instance
- Content is cleared when InTunnel unmounts
- OutTunnel must be mounted before InTunnel for content to appear
