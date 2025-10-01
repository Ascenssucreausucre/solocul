import Leaderboard from "./components/Leaderboard";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
        fontFamily: "Arial",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        SoloQ Challenge - Leaderboard
      </h1>

      {/* Leaderboard */}
      <Leaderboard />
    </main>
  );
}
