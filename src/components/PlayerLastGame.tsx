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
        `https://ddragon.leagueoflegends.com/cdn/15.19.1/data/fr_FR/champion/${championName}.json`
      );
      const data = await response.json();
      const championKey = data.data[championName]?.id;
      return championKey
        ? `https://cdn.dpm.lol/15.19.1/champion/${championKey}/square`
        : null;
    } catch (error) {
      console.error("Erreur:", error);
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
      <div className="p-4 text-center text-[#94a3b8]">
        Aucune partie récente trouvée.
      </div>
    );
  }

  const winners = draft.filter((p) => p.win);
  const losers = draft.filter((p) => !p.win);

  const renderPlayers = (players: typeof draft) =>
    players.map((p, i) => (
      <div
        key={i}
        className="bg-[#1e293b] rounded-lg p-3 border border-[#334155] flex flex-col items-center w-full"
      >
        {championImages[p.champion] && (
          <img
            src={championImages[p.champion]}
            alt={p.champion}
            className="w-24 h-24 object-cover rounded-sm mb-2"
          />
        )}
        <div className="text-center">
          <div className="text-sm font-semibold text-white truncate w-full">
            {p.summonerName}
          </div>
          <div className="text-xs text-[#94a3b8]">
            {p.role} • {p.champion}
          </div>
          <div className={`text-xs font-medium ${p.win ? "text-[#4ade80]" : "text-[#ef4444]"} mt-1`}>
            {p.win ? "Victoire" : "Défaite"} • KDA: {p.kills}/{p.deaths}/{p.assists}
          </div>
        </div>
      </div>
    ));

  return (
    <div className={`p-4 bg-[#0f172a] border-t border-[#334155]`}>
      <h3 className="text-xl font-bold text-white mb-4 text-center">
        Dernière partie {isWin ? <span className="text-[#4ade80]">(Victoire)</span> : <span className="text-[#ef4444]">(Défaite)</span>}
      </h3>

      {/* Gagnants */}
      {winners.length > 0 && (
        <>
          <h4 className="text-lg font-semibold text-[#4ade80] mb-3">Équipe gagnante</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {renderPlayers(winners)}
          </div>
        </>
      )}

      {/* Perdants */}
      {losers.length > 0 && (
        <>
          <h4 className="text-lg font-semibold text-[#ef4444] mb-3">Équipe perdante</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {renderPlayers(losers)}
          </div>
        </>
      )}
    </div>
  );
}
