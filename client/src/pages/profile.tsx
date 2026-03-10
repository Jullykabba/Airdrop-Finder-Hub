import { useAuth, useUpdateProfile } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Send, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";
import { useLocation } from "wouter";

const profileSchema = z.object({
  email: z.string().email("Must be a valid email").optional().or(z.literal('')),
  telegram: z.string().optional().or(z.literal('')),
});

export default function Profile() {
  const { data: user, isLoading } = useAuth();
  const updateProfile = useUpdateProfile();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: "", telegram: "" }
  });

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/");
    } else if (user) {
      form.reset({
        email: user.email || "",
        telegram: user.telegram || ""
      });
    }
  }, [user, isLoading, form, setLocation]);

  if (isLoading || !user) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary"/></div>;

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfile.mutate(values);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-card border border-border shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
        
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-primary to-emerald-500 relative">
          {user.isPremium && (
            <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center shadow-lg">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Premium User
            </div>
          )}
        </div>

        <div className="px-8 pb-8">
          <div className="-mt-12 mb-6 flex items-end">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 border-4 border-card shadow-lg flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground mb-1">Account Settings</h2>
          <p className="text-muted-foreground font-mono text-sm mb-8 break-all">
            {user.walletAddress}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-border space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-5 h-5 text-primary" /> Notification Settings
                </h3>
                
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input {...field} className="pl-10" placeholder="For important updates" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="telegram" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram Handle</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input {...field} className="pl-10" placeholder="@username for instant alerts" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={updateProfile.isPending || !form.formState.isDirty}
                  className="shadow-lg shadow-primary/20"
                >
                  {updateProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Preferences
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
