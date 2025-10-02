"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Trophy, Target } from "lucide-react";
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
    role: string;
    champion: string;
    win: boolean;
    kills: number;
    deaths: number;
    assists: number;
  }>;
};

export default function PlayerCard({ name, tag, rank, wins, losses, winrate, lastMatchDraft }: Props) {
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
    <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden mb-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20  mx-auto">
      <div className="relative p-6 flex items-start gap-6">
        {/* Logo */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-700/50 bg-black/40 backdrop-blur-sm">
            <img src={logoUrl} alt={tier} className="w-full h-full object-cover scale-150" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            {tier.toUpperCase()}
          </div>
        </div>

        {/* Infos joueur */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-white truncate">
            {name} <span className="text-gray-500 font-normal">#{tag}</span>
          </h2>
          <div className="inline-block bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-1 rounded-lg mt-2 border border-gray-600/50">
            <span className="text-sm text-gray-300 font-semibold">{rank}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-black/40 rounded-lg p-3 border border-emerald-500/30 flex flex-col items-center">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <div className="text-xl font-bold text-emerald-400">{wins}</div>
            </div>
            <div className="bg-black/40 rounded-lg p-3 border border-red-500/30 flex flex-col items-center">
              <Target className="w-4 h-4 text-red-400" />
              <div className="text-xl font-bold text-red-400">{losses}</div>
            </div>
            <div className={`bg-black/40 rounded-lg p-3 border ${winrate >= 50 ? "border-emerald-500/30" : "border-red-500/30"} flex flex-col items-center`}>
              <div className={`text-xl font-bold ${winrateColor}`}>{winrate}%</div>
            </div>
          </div>

          {/* Barre progression */}
          <div className="mt-3 h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${winrate >= 50 ? "bg-gradient-to-r from-emerald-500 to-cyan-400" : "bg-gradient-to-r from-red-500 to-orange-400"}`}
              style={{ width: `${winrate}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">{totalGames} parties jouées</div>
        </div>
      </div>

      {/* Toggle dernière partie */}
      <button
        onClick={() => setShowLastGame(!showLastGame)}
        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 active:scale-95"
      >
        {showLastGame ? <><ChevronUp className="w-5 h-5" /> Masquer la dernière partie</> : <><ChevronDown className="w-5 h-5" /> Voir la dernière partie</>}
      </button>

      <div className={`transition-all duration-300 overflow-hidden ${showLastGame ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
        {showLastGame && lastMatchDraft && (
          <PlayerLastGame
            draft={lastMatchDraft}
            isWin={lastMatchDraft.find(p => p.summonerName === name)?.win ?? false}
          />
        )}
      </div>
    </div>
  );
}
