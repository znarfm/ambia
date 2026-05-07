import { ImageResponse } from "next/og";

// Route segment config

// Image metadata
export const alt = "Ambia | Sensory Soundscapes";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
export default function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        background: "#0e0e0e",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#e3c28e",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", marginBottom: 20 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          </svg>
        </div>
        <div style={{ fontSize: 64, fontWeight: "bold", letterSpacing: "0.2em", marginBottom: 40 }}>
          AMBIA
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Enhance Your Focus &amp; Sleep
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.8,
            letterSpacing: "0.05em",
            textAlign: "center",
            padding: "0 40px",
            marginBottom: 60,
          }}
        >
          Experience pure white, natural pink, and deep brown soundscapes.
        </div>

        <div
          style={{
            display: "flex",
            background: "#e3c28e",
            color: "#0e0e0e",
            padding: "20px 40px",
            borderRadius: "100px",
            fontSize: 36,
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}
        >
          Tune Out Distractions
        </div>
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  );
}
