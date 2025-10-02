"use client";

import { useState, useEffect } from "react";

type DraftProps = {
  draft: Array<{
    summonerName: string;
    role: string;
    champion: string;
    win: boolean;
    kills: number;
    deaths: number;
    assists: number;
  }>;
  isWin: boolean;
};

export default function PlayerLastGame({ draft, isWin }: DraftProps) {
  const [championImages, setChampionImages] = useState<Record<string, string>>({});


  const getChampionImageUrl = async (championName: string) => {
    try {
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/14.12.1/data/fr_FR/champion/${championName}.json`
      );
      const data = await response.json();
      const championKey = data.data[championName].id;

      //https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championKey}_0.jpg
      return `https://cdn.dpm.lol/15.19.1/champion/${championKey}/square`;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'image du champion :", error);
      return null;
    }
  };

  useEffect(() => {
    const loadChampionImages = async () => {
      const images: Record<string, string> = {};
      for (const player of draft) {
        const url = await getChampionImageUrl(player.champion);
        if (url) images[player.champion] = url;
      }
      setChampionImages(images);
    };
    loadChampionImages();
  }, [draft]);

  if (!draft || draft.length === 0) {
    return (
      <p style={{ marginTop: "10px", color: "#aaa" }}>
        Aucune partie récente trouvée.
      </p>
    );
  }

  const winners = draft.filter(p => p.win);
  const losers = draft.filter(p => !p.win);

  const renderPlayers = (players: typeof draft) =>
    players.map((p, i) => (
      <div
        key={i}
        style={{
          
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {championImages[p.champion] && (
          <img
            src={championImages[p.champion]}
            alt={p.champion}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontWeight: "bold", color: "#fff" }}>
            {p.summonerName}
          </span>
          <span style={{ color: "#aaa"}}>
            ({p.role}) - {p.champion}
          </span>
          <span style={{ color: p.win ? "#4caf50" : "#f44336" }}>
            {p.win ? "Victoire" : "Défaite"} | KDA: {p.kills}/{p.deaths}/{p.assists}
          </span>
        </div>
      </div>
    ));

  return (
    <div
      style={{
        backgroundColor: isWin ? "#002200" : "#220000",
        padding: "14px",
        borderRadius: "8px",
        marginTop: "12px",
        border: "1px solid #333",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "10px", fontSize: "1.1rem", color: "#ffcc00" }}>
        Dernière partie
      </h3>

      {/* Gagnants */}
      {winners.length > 0 && (
        <>
          <h4 style={{ color: "#4caf50", margin: "8px 0" }}>Gagnants</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {renderPlayers(winners)}
          </div>
        </>
      )}

      {/* Perdants */}
      {losers.length > 0 && (
        <>
          <h4 style={{ color: "#f44336", margin: "12px 0 8px 0" }}>Perdants</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {renderPlayers(losers)}
          </div>
        </>
      )}
    </div>
  );
}
