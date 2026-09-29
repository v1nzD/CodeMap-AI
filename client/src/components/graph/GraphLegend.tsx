export default function GraphLegend() {
  return (
    <div
      style={{
        position: "absolute",

        top: 16,
        left: 16,

        zIndex: 10,

        padding: "12px 16px",

        background: "#ffffff",

        border: "1px solid #e5e7eb",

        borderRadius: 8,

        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",

        fontSize: 12,
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        Graph Legend
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <LegendItem
          label="Imports"
          lineStyle={{
            background: "#2563eb",
          }}
        />

        <LegendItem
          label="Exports"
          lineStyle={{
            background: "#16a34a",
          }}
        />

        <LegendItem
          label="Contains"
          lineStyle={{
            background:
              "repeating-linear-gradient(to right, #9ca3af 0, #9ca3af 5px, transparent 5px, transparent 10px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              background: "#eff6ff",
              border: "1px solid #93c5fd",
              borderRadius: 3,
            }}
          />

          <span>File</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              background: "#ffffff",
              border: "1px solid #d1d5db",
              borderRadius: 3,
            }}
          />

          <span>Function</span>
        </div>
      </div>
    </div>
  );
}

interface LegendItemProps {
  label: string;
  lineStyle: React.CSSProperties;
}

function LegendItem({ label, lineStyle }: LegendItemProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 24,
          height: 2,
          ...lineStyle,
        }}
      />

      <span>{label}</span>
    </div>
  );
}
