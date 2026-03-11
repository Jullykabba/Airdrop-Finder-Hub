import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth as useUser, useLogin } from "@/hooks/use-auth";
import { CryptoTicker } from "./crypto-ticker";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Menu,
  X,
  Zap,
  Shield,
  User as UserIcon,
  LogOut,
  Crown,
  Wallet,
} from "lucide-react";
import {
  SITE_NAME,
  FOOTER_TEXT,
  WHATSAPP_LINK,
  WHATSAPP_LABEL,
  PREMIUM_LINK,
} from "@/config";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: user, isLoading } = useUser();
  const { mutate: loginWithAddress } = useLogin();
  const { toast } = useToast();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        const accounts: string[] = await ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          loginWithAddress(accounts[0], {
            onSuccess: () => {
              toast({
                title: "Wallet Connected",
                description: `${accounts[0].substring(0, 6)}...${accounts[0].slice(-4)}`,
              });
            },
            onError: () => {
              toast({ title: "Login failed", variant: "destructive" });
            },
          });
        }
      } else {
        toast({
          title: "MetaMask not found",
          description: "Install MetaMask or open in Trust Wallet's browser.",
          variant: "destructive",
        });
      }
    } catch {
      toast({ title: "Connection cancelled", variant: "destructive" });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("userWallet");
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/", label: "Airdrops", icon: Zap },
    ...(user?.isAdmin ? [{ href: "/admin", label: "Admin", icon: Shield }] : []),
    ...(user ? [{ href: "/profile", label: "Profile", icon: UserIcon }] : []),
  ];

  const truncateAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CryptoTicker />

      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#080d1a]/90 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight font-display">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {SITE_NAME}
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    location === href
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              {/* Premium — plain <a> tag prevents pushState errors */}
              <a
                href={PREMIUM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
              >
                <Crown className="w-4 h-4" />
                Premium
              </a>
            </nav>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-3">
              {!isLoading && (
                user ? (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-mono font-medium text-foreground">
                        {truncateAddress(user.walletAddress)}
                      </span>
                      {user.isPremium && (
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                          Premium
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDisconnect}
                      title="Disconnect Wallet"
                      data-testid="button-disconnect-wallet"
                    >
                      <LogOut className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className="rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    data-testid="button-connect-wallet-desktop"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {isConnecting ? "Connecting…" : "Connect Wallet"}
                  </Button>
                )
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu ─────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[104px] z-30 bg-white dark:bg-[#080d1a] border-t border-border overflow-y-auto">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-lg font-medium"
              >
                <Icon className="w-5 h-5 text-primary" />
                {label}
              </Link>
            ))}

            {/* Premium mobile */}
            <a
              href={PREMIUM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-lg font-medium text-amber-500"
            >
              <Crown className="w-5 h-5" />
              Premium
            </a>

            <div className="mt-4 pt-4 border-t border-border">
              {user ? (
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground text-center font-mono">
                    {truncateAddress(user.walletAddress)}
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full h-12"
                    onClick={() => {
                      handleDisconnect();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="button-disconnect-mobile"
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    handleConnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isConnecting}
                  data-testid="button-connect-wallet-mobile"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  {isConnecting ? "Connecting…" : "Connect Wallet"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Main content ────────────────────────────────────────── */}
      <main className="flex-1 w-full">{children}</main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-white dark:bg-[#080d1a] border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>{FOOTER_TEXT}</p>
      </footer>

      {/* ─── Floating WhatsApp Button ─────────────────────────────── */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: "#25D366",
          color: "white",
          padding: "14px 20px",
          borderRadius: "50px",
          fontWeight: "bold",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
          textDecoration: "none",
          fontSize: "14px",
        }}
        data-testid="link-whatsapp-float"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {WHATSAPP_LABEL}
      </a>
    </div>
  );
}
