import React, { useEffect, useState } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

interface DebugWindowProps {
  onSetMoney?: (amount: number) => void;
  onSkipEra?: () => void;
  onToggleInstantResearch?: (enabled: boolean) => void;
}

const KonamiDebugWindow: React.FC<DebugWindowProps> = ({
  onSetMoney,
  onSkipEra,
  onToggleInstantResearch,
}) => {
  const [input, setInput] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);
  const [money, setMoney] = useState("");
  const [instantResearch, setInstantResearch] = useState(false);

  useEffect(() => {
    if (activated) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      setInput((prev) => {
        const next = [...prev, e.key].slice(-KONAMI_SEQUENCE.length);
        if (
          next.length === KONAMI_SEQUENCE.length &&
          next.every(
            (k, i) => k.toLowerCase() === KONAMI_SEQUENCE[i].toLowerCase()
          )
        ) {
          setActivated(true);
        }
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activated]);

  const handleInstantResearchToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isEnabled = e.target.checked;
    setInstantResearch(isEnabled);
    if (onToggleInstantResearch) {
      onToggleInstantResearch(isEnabled);
    }
  };

  if (!activated) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        background: "#222",
        color: "#fff",
        padding: "16px 24px",
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        fontFamily: "monospace",
        minWidth: "220px",
      }}
    >
      <h4 style={{ marginTop: 0 }}>🦄 Debug Mode</h4>
      <div style={{ marginBottom: "8px" }}>
        <label>
          Money:{" "}
          <input
            type="number"
            value={money}
            onChange={(e) => setMoney(e.target.value)}
            style={{
              width: "100%",
              background: "#333",
              color: "#fff",
              border: "1px solid #444",
              padding: "4px",
            }}
          />
        </label>
        <button
          style={{ marginTop: "4px", width: "100%" }}
          onClick={() => {
            if (onSetMoney) onSetMoney(Number(money));
          }}
        >
          Set Money
        </button>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <label>
          <input
            type="checkbox"
            checked={instantResearch}
            onChange={handleInstantResearchToggle}
          />{" "}
          Instant Research
        </label>
      </div>
    </div>
  );
};

export default KonamiDebugWindow;
