import "../../../../modules/dogs/styles/dogProfile.css";

export default function Loading() {
  return (
    <div className="dp-page animate-pulse">
      <div style={{ height: 16, background: "#f4f4f5", borderRadius: 4, width: 200, marginBottom: "2rem" }} />

      <div className="dp-layout">
        <div className="dp-aside">
          <div style={{ height: 340, background: "#f4f4f5", borderRadius: "1.5rem" }} />
          <div style={{ height: 120, background: "#f4f4f5", borderRadius: "1.1rem", marginTop: "1.25rem" }} />
          <div style={{ height: 44, background: "#f4f4f5", borderRadius: 999, marginTop: "1.25rem" }} />
        </div>
        <div className="dp-content">
          <div style={{ height: 22, background: "#f4f4f5", borderRadius: 4, width: 100, marginBottom: "0.75rem" }} />
          <div style={{ height: 48, background: "#f4f4f5", borderRadius: 6, width: "55%", marginBottom: "0.5rem" }} />
          <div style={{ height: 20, background: "#f4f4f5", borderRadius: 4, width: "40%", marginBottom: "1.5rem" }} />
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ height: 32, width: 90, background: "#f4f4f5", borderRadius: 999 }} />
            ))}
          </div>
          <div style={{ height: 220, background: "#f4f4f5", borderRadius: "1.25rem", marginBottom: "1.5rem" }} />
          <div style={{ height: 140, background: "#f4f4f5", borderRadius: "1.25rem" }} />
        </div>
      </div>
    </div>
  );
}
