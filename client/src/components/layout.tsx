import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { CryptoTicker } from "./crypto-ticker";

import { Button } from "@/components/ui/button";
import { Menu, X, Coins, Shield, Crown, User as UserIcon, LogOut } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: user, isLoading } = useAuth();
  const { mutate: logout } = useLogout();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        alert("Wallet Connected: " + accounts[0]);
      } catch (error) {
        alert("Connection cancelled.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };
  const navLinks = [
    { href: "/", label: "Airdrops", icon: Coins },
    ...(user?.isAdmin ? [{ href: "/admin", label: "Admin Panel", icon: Shield }] : []),
    ...(user ? [{ href: "/profile", label: "Profile", icon: UserIcon }] : []),
    { href: "https://wa.me/2349133719207?text=I%20want%20to%20join%20AirdropAlertNG%20Premium", label: "Premium", icon: Crown },

  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CryptoTicker />
      
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                AirdropAlert<span className="text-primary">NG</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive 
                        ? "text-primary font-semibold" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Auth/Connect Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {!isLoading && (
                user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-mono font-medium text-foreground">
                        {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}
                      </span>
                      {user.isPremium && (
                        <span className="text-[10px] uppercase font-bold text-accent tracking-wider">Premium</span>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                      <LogOut className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setWalletModalOpen(true)}
                    className="shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold rounded-full px-6"
                  >
                    Connect Wallet
                  </Button>
                )
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[104px] z-30 bg-white dark:bg-slate-950 p-4 border-t border-border animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-lg font-medium"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  {link.label}
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-border mt-4">
              {user ? (
                <Button variant="destructive" className="w-full h-12" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  Disconnect Wallet
                </Button>
              ) : (
                <Button className="w-full h-12 text-lg" onClick={() => {
                    connectWallet();
                    setMobileMenuOpen(false);
                  }} >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      )}


      <main className="flex-1 w-full relative">
        {children}
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} AirdropAlertNG. Designed for the Nigerian Crypto Community.</p>
      </footer>
      <a
        href="https://wa.me/2349133719207" 
        target="_blank"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '50px',
          fontWeight: 'bold',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          textDecoration: 'none'
        }}
      >
        <span>Chat with us 🇳🇬</span>
      </a>

    </div>
  );
}
