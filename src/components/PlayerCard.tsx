"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Trophy, Target, Flame, Award } from "lucide-react";
import PlayerLastGame from "./PlayerLastGame";

type Props = {
  name: string;
  tag: string;
  rank: string;
  wins: number;
  losses: number;
  winrate: number;
  lastMatchDraft?: Array<{
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

export default function PlayerCard({ name, tag, rank, wins, losses, winrate, lastMatchDraft, puuid }: Props) {
  const [showLastGame, setShowLastGame] = useState(false);
  const tier = rank.split(" ")[0].toLowerCase();
  const logoUrl = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-emblem/emblem-${tier}.png`;
  const totalGames = wins + losses;
  const winrateColor =
    winrate >= 55 ? "text-emerald-400" :
    winrate >= 50 ? "text-blue-400" :
    winrate >= 45 ? "text-orange-400" :
    "text-red-400";

  return (
    <div className="group relative bg-gradient-to-br from-[#0a0e1a] via-[#1e293b] to-[#0f172a] rounded-xl overflow-hidden mb-6 border-2 border-[#334155] hover:border-[#8b5cf6] transition-all duration-300 hover:shadow-xl hover:shadow-[#8b5cf6]/40 mx-auto">
      {/* Barre supérieure néon */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-60"></div>

      <div className="relative p-5 flex items-start gap-5">
        {/* Image de rang avec effets */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] blur-xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#1e293b] group-hover:border-[#8b5cf6] transition-all duration-300 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#0f172a]"></div>
            <img src={logoUrl} alt={tier} className="relative w-full h-full object-cover scale-150" />
          </div>
          
          {/* Badge de tier */}
          <div className="absolute -bottom-2 -right-2 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] rounded-lg blur-md opacity-60"></div>
              <div className="relative bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg border border-white/20 uppercase tracking-wide">
                {tier}
              </div>
            </div>
          </div>
        </div>

        {/* Informations du joueur */}
        <div className="flex-1 min-w-0">
          {/* Nom du joueur */}
          <div className="mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white truncate">
              {name} <span className="text-[#64748b] font-normal">#{tag}</span>
            </h2>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1e293b] to-[#0f172a] px-3 py-1.5 rounded-lg mt-2 border border-[#334155]">
              <Award className="w-3.5 h-3.5 text-[#8b5cf6]" />
              <span className="text-xs text-white font-semibold">{rank}</span>
            </div>
          </div>

          {/* Stats en grille */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {/* Victoires */}
            <div className="relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-lg p-3 border border-[#10b981]/30 hover:border-[#10b981] transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex flex-col items-center">
                <Trophy className="w-4 h-4 text-[#10b981] mb-1" />
                <div className="text-xl font-bold text-[#10b981]">{wins}</div>
                <div className="text-xs text-[#64748b] font-semibold mt-0.5">Wins</div>
              </div>
            </div>

            {/* Défaites */}
            <div className="relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-lg p-3 border border-[#ef4444]/30 hover:border-[#ef4444] transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex flex-col items-center">
                <Target className="w-4 h-4 text-[#ef4444] mb-1" />
                <div className="text-xl font-bold text-[#ef4444]">{losses}</div>
                <div className="text-xs text-[#64748b] font-semibold mt-0.5">Losses</div>
              </div>
            </div>

            {/* Winrate */}
            <div className={`relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-lg p-3 border ${winrate >= 50 ? "border-[#10b981]/30 hover:border-[#10b981]" : "border-[#ef4444]/30 hover:border-[#ef4444]"} transition-all duration-300 hover:scale-105 cursor-pointer`}>
              <div className="flex flex-col items-center">
                <Flame className={`w-4 h-4 ${winrate >= 50 ? "text-[#10b981]" : "text-[#ef4444]"} mb-1`} />
                <div className={`text-xl font-bold ${winrateColor}`}>{winrate}%</div>
                <div className="text-xs text-[#64748b] font-semibold mt-0.5">WR</div>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-4">
            <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden border border-[#334155]">
              <div
                className={`h-full transition-all duration-500 ${winrate >= 50 ? "bg-gradient-to-r from-[#10b981] to-[#059669]" : "bg-gradient-to-r from-[#ef4444] to-[#dc2626]"}`}
                style={{ width: `${winrate}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5">
              <div className="text-xs text-[#64748b] font-medium">
                {totalGames} parties
              </div>
              <div className={`text-xs font-bold ${winrateColor}`}>
                {wins}W - {losses}L
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton pour afficher la dernière partie */}
      <div className="px-5 pb-5">
        <button
          onClick={() => setShowLastGame(!showLastGame)}
          className="relative w-full bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#3b82f6] hover:from-[#7c3aed] hover:via-[#5b21b6] hover:to-[#2563eb] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#8b5cf6]/50 active:scale-95 text-sm overflow-hidden group/button"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
          {showLastGame ? (
            <>
              <ChevronUp className="w-5 h-5" />
              <span>Masquer la partie</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5" />
              <span>Voir la dernière partie</span>
            </>
          )}
        </button>
      </div>

      {/* Dernière partie */}
      <div className={`transition-all duration-500 overflow-hidden ${showLastGame ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
        {showLastGame && lastMatchDraft && lastMatchDraft.length > 0 ? (
          <PlayerLastGame
            draft={lastMatchDraft}
            isWin={lastMatchDraft.some((p) => p.puuid === puuid && p.win)}
            playerPuuid={puuid}
          />
        ) : (
          showLastGame && (
            <div className="p-6 text-center bg-gradient-to-b from-[#0a0e1a] to-[#0f172a]">
              <div className="inline-block bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-2 border-[#334155] rounded-xl p-6 shadow-xl">
                <div className="text-5xl mb-3">🎮</div>
                <div className="text-[#94a3b8] font-bold uppercase tracking-wide">Aucune partie récente</div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}