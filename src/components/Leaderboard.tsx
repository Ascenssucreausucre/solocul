"use client";
import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";

type PlayerData = {
  name: string;
  tag: string;
  rank: string;
  wins: number;
  losses: number;
  winrate: number;
  lastMatchDraft: Array<{
    summonerName: string;
    puuid: string;
    champion: string;
    role: string;
    summonerSpells: number[];
    win: boolean;
    kills: number;
    deaths: number;
    assists: number;
  }>;
  puuid: string;
};

export default function Leaderboard() {
  const API_KEY = "RGAPI-525ffa0c-93b9-4af1-80b7-8b02120c73a3";
  const [playersInput] = useState([
    { gameName: "Inertie", tagLine: "00000" },
    { gameName: "tartofoutr", tagLine: "HPI" },
    { gameName: "Patito Willix", tagLine: "EUW" },
  ]);
  const [playersData, setPlayersData] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(false);

  const TARGET_DATE = new Date("2025-10-02"); 

  const fetchPlayer = async (gameName: string, tagLine: string): Promise<PlayerData> => {
    try {
      const encodedGameName = encodeURIComponent(gameName.trim());
      const encodedTagLine = encodeURIComponent(tagLine.trim());

      // 1. Récupérer le compte → puuid
      const accountRes = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!accountRes.ok) throw new Error("Impossible de récupérer le joueur.");
      const accountData = await accountRes.json();
      const puuid = accountData.puuid;

      // 2. Récupérer le classement actuel (SoloQ)
      let rank = "Non classé";
      const leagueRes = await fetch(
        `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (leagueRes.ok) {
        const leagueData = await leagueRes.json();
        const soloQ = leagueData.find((entry: any) => entry.queueType === "RANKED_SOLO_5x5");
        if (soloQ) {
          rank = `${soloQ.tier} ${soloQ.rank} ${soloQ.leaguePoints} LP`;
        }
      }

      // 3. Récupérer les matchs récents
      const matchesRes = await fetch(
        `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`,
        { headers: { "X-Riot-Token": API_KEY } }
      );
      if (!matchesRes.ok) throw new Error("Impossible de récupérer les matchs.");
      const matchIds: string[] = await matchesRes.json();

      let wins = 0;
      let losses = 0;
      let lastMatchDraft: PlayerData["lastMatchDraft"] = [];

      for (const matchId of matchIds) {
        const matchRes = await fetch(
          `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`,
          { headers: { "X-Riot-Token": API_KEY } }
        );
        if (!matchRes.ok) continue;
        const matchData = await matchRes.json();

        const gameDate = new Date(matchData.info.gameStartTimestamp);
        const isSameDay =
          gameDate.getUTCFullYear() === TARGET_DATE.getUTCFullYear() &&
          gameDate.getUTCMonth() === TARGET_DATE.getUTCMonth() &&
          gameDate.getUTCDate() === TARGET_DATE.getUTCDate();

        if (isSameDay) {
          const player = matchData.info.participants.find((p: any) => p.puuid === puuid);
          if (player) {
            if (player.win) wins++;
            else losses++;
          }
        }

        // garder le draft du premier match qu’on parcourt
        if (lastMatchDraft.length === 0) {
          lastMatchDraft = matchData.info.participants.map((p: any) => ({
            summonerName: p.summonerName || "",
            puuid: p.puuid,
            champion: p.championName,
            role: p.teamPosition,
            summonerSpells: [p.summoner1Id, p.summoner2Id],
            win: p.win,
            kills: p.kills,
            deaths: p.deaths,
            assists: p.assists,
          }));
        }
      }

      const winrate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

      return {
        name: gameName,
        tag: tagLine,
        rank,
        wins,
        losses,
        winrate,
        lastMatchDraft,
        puuid,
      };
    } catch (err: any) {
      console.error(err);
      return {
        name: gameName,
        tag: tagLine,
        rank: "❌ " + err.message,
        wins: 0,
        losses: 0,
        winrate: 0,
        lastMatchDraft: [],
        puuid: "",
      };
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
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1>Leaderboard SoloQ (02/10/2025)</h1>
      <button
        onClick={fetchAllPlayers}
        disabled={loading}
        style={{
          padding: "8px 16px",
          backgroundColor: loading ? "#555" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "20px",
        }}
      >
        {loading ? "Chargement..." : "Mettre à jour"}
      </button>
      {playersData.map((p, i) => (
        <PlayerCard key={i} {...p} />
      ))}
    </div>
  );
}
