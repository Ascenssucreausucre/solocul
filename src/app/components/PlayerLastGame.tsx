type DraftProps = {
  draft: any[];
};

export default function PlayerLastGame({ draft }: DraftProps) {
  if (!draft || draft.length === 0) return null;

  return (
    <div style={{ backgroundColor: "#420000ff", padding: "20px", borderRadius: "8px", marginTop: "10px", marginBottom: "10px" }}>
      <h3>Dernière partie - Draft :</h3>
      {draft.map((p, i) => (
        <div key={i} style={{ borderBottom: "1px solid #555", padding: "4px 0" }}>
          <strong>{p.summonerName}</strong> ({p.role}) - Champion: {p.champion} - {p.win ? "Victoire" : "Défaite"} - Sorts: {p.summonerSpells.join(", ")}
        </div>
      ))}
    </div>
  );
}
