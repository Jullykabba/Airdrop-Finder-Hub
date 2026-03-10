import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useAirdrops, useCreateAirdrop, useUpdateAirdrop, useDeleteAirdrop } from "@/hooks/use-airdrops";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Airdrop } from "@shared/schema";

// Form schema matching the backend input schema
const formSchema = z.object({
  tokenName: z.string().min(1, "Required"),
  symbol: z.string().min(1, "Required"),
  network: z.string().min(1, "Required"),
  rewardAmount: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  link: z.string().url("Must be a valid URL"),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
  isActive: z.boolean().default(true),
});

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isAuthLoading } = useAuth();
  const { data: airdrops, isLoading: isAirdropsLoading } = useAirdrops();
  const deleteMutation = useDeleteAirdrop();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);

  if (isAuthLoading) return <div className="p-8 text-center text-muted-foreground"><Loader2 className="animate-spin inline mr-2"/> Loading...</div>;
  if (!user?.isAdmin) {
    setLocation("/");
    return null;
  }

  const openCreate = () => {
    setEditingAirdrop(null);
    setIsFormOpen(true);
  };

  const openEdit = (airdrop: Airdrop) => {
    setEditingAirdrop(airdrop);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this airdrop?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">Manage airdrop listings and platform content.</p>
        </div>
        <Button onClick={openCreate} className="shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> Add Airdrop
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Token</th>
                <th className="px-6 py-4">Network</th>
                <th className="px-6 py-4">Reward</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isAirdropsLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td>
                </tr>
              ) : airdrops?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No airdrops found.</td>
                </tr>
              ) : (
                airdrops?.map(item => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{item.tokenName}</div>
                      <div className="text-xs text-muted-foreground">{item.symbol}</div>
                    </td>
                    <td className="px-6 py-4">{item.network}</td>
                    <td className="px-6 py-4">{item.rewardAmount}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {format(new Date(item.startDate), "MMM d, yyyy")} - <br/>
                      {format(new Date(item.endDate), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AirdropFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingAirdrop} 
      />
    </div>
  );
}

function AirdropFormModal({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData: Airdrop | null }) {
  const createMutation = useCreateAirdrop();
  const updateMutation = useUpdateAirdrop();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: "", symbol: "", network: "", rewardAmount: "", description: "", link: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      isActive: true
    }
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData && isOpen) {
      form.reset({
        ...initialData,
        startDate: new Date(initialData.startDate).toISOString().split('T')[0],
        endDate: new Date(initialData.endDate).toISOString().split('T')[0],
      });
    } else if (isOpen) {
      form.reset({
        tokenName: "", symbol: "", network: "", rewardAmount: "", description: "", link: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        isActive: true
      });
    }
  }, [initialData, isOpen, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, ...payload }, {
        onSuccess: () => onClose()
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onClose()
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">{initialData ? "Edit Airdrop" : "Create New Airdrop"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="tokenName" render={({ field }) => (
                <FormItem><FormLabel>Token Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="symbol" render={({ field }) => (
                <FormItem><FormLabel>Symbol</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="network" render={({ field }) => (
                <FormItem><FormLabel>Network</FormLabel><FormControl><Input {...field} placeholder="e.g. Ethereum, BSC" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="rewardAmount" render={({ field }) => (
                <FormItem><FormLabel>Reward Amount</FormLabel><FormControl><Input {...field} placeholder="e.g. 500 TKN" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <FormField control={form.control} name="link" render={({ field }) => (
              <FormItem><FormLabel>Claim Link (URL)</FormLabel><FormControl><Input {...field} type="url" /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input {...field} type="date" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem><FormLabel>End Date</FormLabel><FormControl><Input {...field} type="date" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="flex justify-end pt-4 gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {initialData ? "Save Changes" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
