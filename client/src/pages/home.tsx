import { useState } from "react";
import { useAirdrops } from "@/hooks/use-airdrops";
import { AirdropCard } from "@/components/airdrop-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Rocket, Coins } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [network, setNetwork] = useState("");
  const { data: airdrops, isLoading } = useAirdrops({ search, network });

  const networks = ["All", "Ethereum", "BSC", "Solana", "Polygon", "TON", "Arbitrum"];

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 pt-20 pb-24 border-b border-primary/20">
        {/* landing page hero abstract dark background with green glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-4 py-1.5 text-sm font-medium rounded-full">
            <Rocket className="w-4 h-4 mr-2 inline-block" />
            Discover the Best Web3 Opportunities
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 text-balance mx-auto">
            AirdropAlert <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">
              Nigeria
            </span>  🇳🇬 Again
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 text-balance">
            The #1 platform for Naija crypto hunters to find verified airdrops.".
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Filters Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-black/5 p-4 flex flex-col md:flex-row gap-4 mb-8 border border-slate-200 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search tokens or projects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-slate-50 dark:bg-slate-950 border-transparent focus:bg-white focus:border-primary focus:ring-primary/20 text-base"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0 items-center pl-2 md:border-l border-border md:pl-4">
            <Filter className="w-5 h-5 text-muted-foreground mr-2 hidden md:block" />
            {networks.map(net => (
              <Button
                key={net}
                variant={network === (net === "All" ? "" : net) ? "default" : "outline"}
                className="rounded-full shrink-0"
                onClick={() => setNetwork(net === "All" ? "" : net)}
              >
                {net}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[280px] rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : !airdrops?.length ? (
          <div className="text-center py-24 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-border">
            <Coins className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold text-foreground mb-2">No Airdrops Found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airdrops.map((airdrop) => (
              <AirdropCard key={airdrop.id} airdrop={airdrop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
