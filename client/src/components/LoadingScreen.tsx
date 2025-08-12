export default function LoadingScreen() {
  return (
    <div className="loading-screen show fixed inset-0 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold terminal-glow mb-4 tracking-wider">BUTTON TYCOON</h1>
        <p className="text-lg mb-8 terminal-medium-green">The Evolution of User Interface</p>
        
        <div className="mb-8">
          <p className="text-sm mb-2">INITIALIZING SYSTEM.</p>
          <div className="w-80 h-4 border border-current terminal-bg">
            <div className="progress-bar h-full"></div>
          </div>
        </div>
        
        <div className="ascii-art text-xs terminal-dark-green">
          <pre>{`    ┌─────────────────────────────────────┐
    │  AUTOMATED ASSEMBLY CORPORATION     │
    │  ═══════════════════════════════    │
    │  SYSTEM BOOT SEQUENCE v1.0          │
    │                                     │
    │  [████████████████████████████████] │
    │                                     │
    │  Loading drivers...                 │
    │  Initializing hardware...           │
    │  Starting terminal interface...     │
    └─────────────────────────────────────┘`}</pre>
        </div>
      </div>
    </div>
  );
}
