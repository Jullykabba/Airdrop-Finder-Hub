import { Airdrop } from "@shared/schema";
import { format, isPast, isFuture } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Coins, Clock } from "lucide-react";

interface AirdropCardProps {
  airdrop: Airdrop;
}

export function AirdropCard({ airdrop }: AirdropCardProps) {
  const startDate = new Date(airdrop.startDate);
  const endDate = new Date(airdrop.endDate);
  
  const status = !airdrop.isActive 
    ? "inactive" 
    : isPast(endDate) 
      ? "ended" 
      : isFuture(startDate) 
        ? "upcoming" 
        : "active";

  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    upcoming: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    ended: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    inactive: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  return (
    <div className="glass-card rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
      {/* Decorative gradient blob */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 z-10">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-inner text-lg font-display font-bold text-slate-700 dark:text-slate-300">
            {airdrop.symbol.substring(0, 2)}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground leading-tight">
              {airdrop.tokenName}
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Coins className="w-3 h-3" />
              {airdrop.network}
            </span>
          </div>
        </div>
        <Badge variant="outline" className={`capitalize z-10 font-semibold px-2.5 py-0.5 ${statusColors[status]}`}>
          {status}
        </Badge>
      </div>

      <div className="flex-1 z-10">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {airdrop.description}
        </p>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 mb-6 border border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-1 font-medium">Reward Pool</div>
          <div className="font-display font-bold text-primary text-base">
            {airdrop.rewardAmount}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-3 z-10">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {format(startDate, "MMM d")}
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1 mx-3" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {format(endDate, "MMM d")}
          </div>
        </div>

        <a 
          href={airdrop.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`
            w-full flex items-center justify-center gap-2 h-10 rounded-xl font-semibold text-sm transition-all
            ${status === 'active' 
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20" 
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-not-allowed"}
          `}
          onClick={(e) => status !== 'active' && e.preventDefault()}
        >
          {status === 'active' ? "Claim Airdrop" : "Not Available"}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
