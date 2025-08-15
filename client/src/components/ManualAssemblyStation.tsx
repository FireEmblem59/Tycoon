import { useState } from "react";
import { GameState } from "../hooks/useGameState";

interface ManualAssemblyStationProps {
  gameState: GameState;
  onAssembly: () => void;
}

export default function ManualAssemblyStation({
  gameState,
  onAssembly,
}: ManualAssemblyStationProps) {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackClass, setFeedbackClass] = useState("");

  const handleAssemblyCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();

    if (
      cmd === gameState.assemblyCommand ||
      (gameState.assemblyCommand === "a" &&
        ["assemble", "asmb", "a"].includes(cmd)) ||
      (gameState.assemblyCommand === "asmb" &&
        ["assemble", "asmb"].includes(cmd))
    ) {
      onAssembly();
      setFeedback(`SUCCESS: Assembly completed (+$${gameState.assemblyValue})`);
      setFeedbackClass("terminal-green");
    } else if (cmd === "") {
      setFeedback("");
      setFeedbackClass("");
    } else {
      setFeedback(
        `ERROR: Invalid command. Type "${gameState.assemblyCommand}"`
      );
      setFeedbackClass("text-red-400");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAssemblyCommand(input);
      setInput("");
    }
  };

  const handleExecClick = () => {
    handleAssemblyCommand(input);
    setInput("");
  };

  return (
    <div className="terminal-border p-4">
      <div className="text-center text-lg font-bold mb-4 terminal-glow">
        MANUAL ASSEMBLY STATION
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="mr-2">{">"}</span>
          <input
            type="text"
            className="terminal-input flex-1"
            placeholder={`Type "${gameState.assemblyCommand}"...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onPaste={(e) => {
              if (!gameState.clipboardEnabled) {
                e.preventDefault();
                setFeedback(
                  'ERROR: Clipboard disabled - research "clipboard-api"'
                );
                setFeedbackClass("text-red-400");
              }
            }}
          />
          <div
            className="ml-2 px-3 py-1 border border-current cursor-pointer hover:bg-opacity-20 hover:bg-current"
            onClick={handleExecClick}
          >
            EXEC
          </div>
        </div>
      </div>

      <div className="text-sm terminal-medium-green space-y-1">
        <div className={`min-h-[20px] ${feedbackClass}`}>{feedback}</div>
        <div>Productivity: ${gameState.assemblyValue} per assembly</div>
        <div>Sessions completed: {gameState.sessions}</div>
        {!gameState.clipboardEnabled && (
          <div className="terminal-dark-green">
            [Clipboard disabled - research "clipboard-api"]
          </div>
        )}
      </div>

      {/* ASCII Schematics (appears after research) */}
      {gameState.asciiSchematicsEnabled && (
        <div className="mt-6 text-xs terminal-dark-green ascii-art">
          <pre>{`     ┌─────────────────┐
     │  ASSEMBLY UNIT  │
     │                 │
     │  [INPUT]  ────> │
     │     │           │
     │     ▼           │
     │  [PROCESS] ───> │
     │     │           │
     │     ▼           │
     │  [OUTPUT] ────> │
     └─────────────────┘`}</pre>
        </div>
      )}
    </div>
  );
}
