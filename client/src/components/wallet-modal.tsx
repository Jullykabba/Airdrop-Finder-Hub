import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-auth";
import { Wallet, Loader2, ShieldCheck } from "lucide-react";

export function WalletModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [address, setAddress] = useState("");
  const { mutate: login, isPending } = useLogin();

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || address.length < 10) return;
    
    login(address, {
      onSuccess: () => {
        onClose();
        setAddress("");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center flex items-center justify-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-2">
            Simulate your Web3 wallet connection. Enter a mock ETH/BSC address to proceed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConnect} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="e.g. 0x71C...976F"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-center font-mono placeholder:text-slate-400"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
            disabled={isPending || address.length < 10}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Connect Securely"
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            No actual funds are at risk.
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
