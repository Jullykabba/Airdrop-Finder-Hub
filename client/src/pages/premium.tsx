import { useAuth, useUpdateProfile } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Crown, Check, Zap, BellRing, Target, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Premium() {
  const { data: user, isLoading } = useAuth();
  const updateProfile = useUpdateProfile();
  const [, setLocation] = useLocation();

  const handleSubscribe = () => {
    if (!user) {
      alert("Please connect your wallet first!");
      return;
    }
    // Simulate payment / upgrade
    updateProfile.mutate({ isPremium: true }, {
      onSuccess: () => {
        alert("Welcome to Premium! Your account has been upgraded.");
      }
    });
  };

  const benefits = [
    { title: "Daily Summary Alerts", desc: "Get curated summaries of top airdrops straight to Telegram.", icon: BellRing },
    { title: "Early Access", desc: "See new airdrops 24 hours before free users.", icon: Zap },
    { title: "Hidden Gems", desc: "Access exclusive, low-radar alpha airdrops.", icon: Target },
  ];

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary"/></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 text-accent mb-6 shadow-xl shadow-accent/10">
          <Crown className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          Upgrade your Airdrop Game
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stop missing out on life-changing airdrops. Get the edge with real-time notifications and exclusive alpha tailored for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left: Features */}
        <div className="space-y-6 order-2 md:order-1">
          {benefits.map((b, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors">
              <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{b.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Pricing Card */}
        <div className="order-1 md:order-2">
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-2xl shadow-primary/20 border border-slate-700 overflow-hidden">
            {/* abstract glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/20 blur-3xl rounded-full" />
            
            <div className="relative z-10">
              <div className="text-accent font-bold tracking-widest text-sm uppercase mb-2">Pro Access</div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-display font-bold">$9</span>
                <span className="text-slate-400">/ month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {["Unlimited active airdrop alerts", "Telegram & WhatsApp integration", "No ads, clean interface", "Priority customer support"].map((ft, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    {ft}
                  </li>
                ))}
              </ul>

              {user?.isPremium ? (
                <Button className="w-full h-14 text-lg bg-emerald-500 hover:bg-emerald-600 text-white pointer-events-none">
                  <Check className="w-5 h-5 mr-2" /> You are Premium
                </Button>
              ) : (
                <Button 
                  onClick={handleSubscribe} 
                  disabled={updateProfile.isPending}
                  className="w-full h-14 text-lg bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25 hover:-translate-y-1 transition-all"
                >
                  {updateProfile.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Subscribe with Crypto"}
                </Button>
              )}
              
              <p className="text-center text-xs text-slate-500 mt-4">
                Mock payment simulation. Connect wallet first.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
