type Props = {
  name: string;
  tag: string;
  rank: string;
  wins: number;
  losses: number;
  winrate: number;
};

export default function PlayerCard({ name, tag, rank, wins, losses, winrate }: Props) {
  return (
    <div style={{ backgroundColor: "#222", padding: "16px", borderRadius: "8px", marginBottom: "10px" }}>
      <h2>{name}#{tag}</h2>
      <p><strong>Classement:</strong> {rank}</p>
      <p><strong>Victoires:</strong> {wins}</p>
      <p><strong>Défaites:</strong> {losses}</p>
      <p><strong>Winrate:</strong> {winrate}%</p>
    </div>
  );
}
