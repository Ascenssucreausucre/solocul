"use client";
import { useState } from "react";
import PlayerLastGame from "./PlayerLastGame";

type Props = {
  name: string;
  tag: string;
  rank: string;
  wins: number;
  losses: number;
  winrate: number;
  lastMatchDraft?: any[];
};

export default function PlayerCard({ name, tag, rank, wins, losses, winrate, lastMatchDraft }: Props) {
  const [showLastGame, setShowLastGame] = useState(false);

  // Récupération du tier (ex: GOLD, SILVER…)
  const tier = rank.split(" ")[0].toLowerCase();
  const logoUrl = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/emblem-${tier}.png
`;

 return (
  <div
    style={{
      background: "linear-gradient(145deg, #1c1c1c, #2b2b2b)",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "16px",
      boxShadow: "0px 4px 15px rgba(0,0,0,0.5)",
      transition: "transform 0.5s",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      {/* Container qui "masque" l'image (zoom cadré) */}
      <div
        style={{
          width: "100px",       
          overflow: "hidden",
          borderRadius: "12px", 
          flexShrink: 0,
        }}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt={tier}
            style={{
              width: "200px",       // plus grand que le conteneur = zoom
              height: "200px",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        )}
      </div>

      {/* Texte à droite du logo */}
      <div>
        <h2 style={{ margin: "0", fontSize: "1.4rem", fontWeight: "bold" }}>
          {name}#{tag}
        </h2>
        <p style={{ margin: "4px 0" }}>
          <strong>Classement:</strong> {rank}
        </p>
        <p style={{ margin: "4px 0" }}>
          <strong>Victoires:</strong> {wins} | <strong>Défaites:</strong> {losses}
        </p>
        <p
          style={{
            margin: "4px 0",
            color: winrate >= 50 ? "#4caf50" : "#f44336",
          }}
        >
          <strong>Winrate:</strong> {winrate}%
        </p>
      </div>
    </div>

    {/* Bouton toggle pour la dernière game */}
    <button
      onClick={() => setShowLastGame(!showLastGame)}
      style={{
        marginTop: "12px",
        padding: "8px 14px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      {showLastGame ? "Masquer la dernière partie" : "Voir la dernière partie"}
    </button>

    {/* Menu déroulant */}
    {showLastGame && <PlayerLastGame
    draft={lastMatchDraft || []}
    isWin={
      lastMatchDraft && lastMatchDraft.length > 0
        ? lastMatchDraft.find(p => p.summonerName === name)?.win ?? false
        : false
    }
  />}
  </div>
);
}