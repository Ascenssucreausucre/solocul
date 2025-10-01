"use client";

import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import PlayerLastGame from "./PlayerLastGame";

type PlayerData = {
  name: string;
  tag: string;
  rank: string;
  wins: number;
  losses: number;
  winrate: number;
  lastMatchDraft?: any[];
};

export default function Leaderboard() {
  const API_KEY = "RGAPI-4d3ef0c6-2144-4879-8c03-6094cad67813";

  const [playersInput] = useState([
    { gameName: "Inertie", tagLine: "00000" },
    { gameName: "tartofoutr", tagLine: "HPI" },
    { gameName: "Patate de Combat", tagLine: "9470" },
  ]);
  const [playersData, setPlayersData] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlayer = async (gameName: string, tagLine: string) => {
    try {
      const encodedGameName = encodeURIComponent(gameName.trim());
      const encodedTagLine = encodeURIComponent(tagLine.trim());

      const accountRes = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!accountRes.ok) throw new Error("Impossible de récupérer le joueur.");
      const accountData = await accountRes.json();
      const puuid = accountData.puuid;

      const leagueRes = await fetch(
        `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${accountData.id}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );

      let leagueData = [];
      if (leagueRes.ok) {
        leagueData = await leagueRes.json();
      } else {
        const leagueResAlt = await fetch(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
          { headers: { "X-Riot-Token": API_KEY } }
        );
        if (!leagueResAlt.ok) throw new Error("Impossible de récupérer le classement.");
        leagueData = await leagueResAlt.json();
      }

      const soloQ = leagueData.find((entry: any) => entry.queueType === "RANKED_SOLO_5x5");
      let rank = "Non classé";
      let wins = 0;
      let losses = 0;
      if (soloQ) {
        rank = `${soloQ.tier} ${soloQ.rank} ${soloQ.leaguePoints} LP`;
        wins = soloQ.wins;
        losses = soloQ.losses;
      }
      const winrate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

      const matchesRes = await fetch(
        `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`,
        { headers: { "X-Riot-Token": API_KEY } }
      );

      let lastMatchDraft: any[] = [];
      if (matchesRes.ok) {
        const matchIds = await matchesRes.json();
        if (matchIds.length > 0) {
          const lastMatchId = matchIds[0];
          const matchRes = await fetch(
            `https://europe.api.riotgames.com/lol/match/v5/matches/${lastMatchId}`,
            { headers: { "X-Riot-Token": API_KEY } }
          );
          if (matchRes.ok) {
            const matchData = await matchRes.json();
            lastMatchDraft = matchData.info.participants.map((p: any) => ({
              summonerName: p.summonerName,
              champion: p.championName,
              role: p.teamPosition,
              summonerSpells: [p.summoner1Id, p.summoner2Id],
              win: p.win,
            }));
          }
        }
      }

      return { name: gameName, tag: tagLine, rank, wins, losses, winrate, lastMatchDraft };
    } catch (err: any) {
      console.error(err);
      return { name: gameName, tag: tagLine, rank: "❌ " + err.message, wins: 0, losses: 0, winrate: 0, lastMatchDraft: [] };
    }
  };

  const fetchAllPlayers = async () => {
    setLoading(true);
    const results = await Promise.all(playersInput.map(p => fetchPlayer(p.gameName, p.tagLine)));
    setPlayersData(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", backgroundColor: "#121212", color: "#fff", minHeight: "100vh" }}>
      <h1>Leaderboard SoloCUL</h1>
      <button
        onClick={fetchAllPlayers}
        disabled={loading}
        style={{ padding: "8px 16px", backgroundColor: loading ? "#555" : "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer", marginBottom: "20px" }}
      >
        {loading ? "Chargement..." : "Mettre à jour"}
      </button>

      {playersData.map((p, i) => (
        <div key={i}>
          <PlayerCard {...p} />
          <PlayerLastGame draft={p.lastMatchDraft || []} />
        </div>
      ))}
    </div>
  );
}
