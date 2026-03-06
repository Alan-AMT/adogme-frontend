import "../../../modules/dogs/styles/catalog.css";

export default function Loading() {
  return (
    <div className="lg:mx-10 mx-5 py-8 animate-pulse">
      <div className="cat-layout">
        {/* Sidebar skeleton */}
        <aside className="cat-sidebar cat-sidebar--desktop">
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ height: 20, background: "#f4f4f5", borderRadius: 6, width: "60%" }} />
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div style={{ height: 14, background: "#f4f4f5", borderRadius: 4, width: "40%", marginBottom: "0.75rem" }} />
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {[1, 2, 3].map((j) => (
                    <div key={j} style={{ height: 32, width: 70, background: "#f4f4f5", borderRadius: 999 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main skeleton */}
        <main className="cat-main">
          <div className="cat-main__header">
            <div>
              <div style={{ height: 12, background: "#f4f4f5", borderRadius: 4, width: 80, marginBottom: "0.5rem" }} />
              <div style={{ height: 28, background: "#f4f4f5", borderRadius: 6, width: 300, marginBottom: "0.5rem" }} />
              <div style={{ height: 16, background: "#f4f4f5", borderRadius: 4, width: 240 }} />
            </div>
          </div>

          <div style={{ height: 48, background: "#f4f4f5", borderRadius: 999, marginBottom: "1.5rem" }} />

          <div className="cat-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="cat-dog-frame" style={{ minHeight: 360 }}>
                <div className="cat-dog-panel">
                  <div style={{ height: 200, background: "#f4f4f5" }} />
                  <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ height: 20, background: "#f4f4f5", borderRadius: 4, width: "60%" }} />
                    <div style={{ height: 14, background: "#f4f4f5", borderRadius: 4, width: "40%" }} />
                    <div style={{ height: 12, background: "#f4f4f5", borderRadius: 4, width: "80%", marginTop: "0.5rem" }} />
                    <div style={{ height: 12, background: "#f4f4f5", borderRadius: 4, width: "70%" }} />
                    <div style={{ height: 36, background: "#f4f4f5", borderRadius: 999, marginTop: "0.5rem" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
