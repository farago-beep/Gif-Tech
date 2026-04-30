import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type ClientInvoice = Database["public"]["Tables"]["client_invoices"]["Row"];
type VendorInvoice = Database["public"]["Tables"]["vendor_invoices"]["Row"];
type InvStatus = Database["public"]["Enums"]["invoice_status"];

const STATUSES: InvStatus[] = ["Payé", "En attente"];

const statusBadge: Record<InvStatus, string> = {
  "Payé": "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  "En attente": "bg-amber-500/20 text-amber-300 border-amber-500/40",
};

const eur = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

export default function FinanceTab() {
  const [clientInvoices, setClientInvoices] = useState<ClientInvoice[]>([]);
  const [vendorInvoices, setVendorInvoices] = useState<VendorInvoice[]>([]);

  const [openClient, setOpenClient] = useState(false);
  const [openVendor, setOpenVendor] = useState(false);
  const [clientForm, setClientForm] = useState({ client_name: "", invoice_number: "", amount: "", status: "En attente" as InvStatus, due_date: "" });
  const [vendorForm, setVendorForm] = useState({ vendor_name: "", invoice_number: "", amount: "", status: "En attente" as InvStatus, scheduled_payment_date: "" });

  const load = async () => {
    const [c, v] = await Promise.all([
      supabase.from("client_invoices").select("*").order("issued_at", { ascending: false }),
      supabase.from("vendor_invoices").select("*").order("received_at", { ascending: false }),
    ]);
    if (c.error) toast.error(c.error.message); else setClientInvoices(c.data ?? []);
    if (v.error) toast.error(v.error.message); else setVendorInvoices(v.data ?? []);
  };
  useEffect(() => { load(); }, []);

  const totalCA = clientInvoices.reduce((s, i) => s + Number(i.amount), 0);
  const totalFrais = vendorInvoices.reduce((s, i) => s + Number(i.amount), 0);

  const updateClientStatus = async (id: string, status: InvStatus) => {
    const { error } = await supabase.from("client_invoices").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else setClientInvoices((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));
  };
  const updateVendorStatus = async (id: string, status: InvStatus) => {
    const { error } = await supabase.from("vendor_invoices").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else setVendorInvoices((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const submitClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("client_invoices").insert({
      client_name: clientForm.client_name,
      invoice_number: clientForm.invoice_number || null,
      amount: Number(clientForm.amount),
      status: clientForm.status,
      due_date: clientForm.due_date || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Facture ajoutée");
    setOpenClient(false);
    setClientForm({ client_name: "", invoice_number: "", amount: "", status: "En attente", due_date: "" });
    load();
  };
  const submitVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("vendor_invoices").insert({
      vendor_name: vendorForm.vendor_name,
      invoice_number: vendorForm.invoice_number || null,
      amount: Number(vendorForm.amount),
      status: vendorForm.status,
      scheduled_payment_date: vendorForm.scheduled_payment_date || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Facture ajoutée");
    setOpenVendor(false);
    setVendorForm({ vendor_name: "", invoice_number: "", amount: "", status: "En attente", scheduled_payment_date: "" });
    load();
  };

  const remove = async (table: "client_invoices" | "vendor_invoices", id: string) => {
    if (!confirm("Supprimer ?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5 border-gold/30 bg-gradient-to-br from-card to-card/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total CA facturé</p>
              <p className="text-2xl md:text-3xl font-display text-gradient-gold mt-1">{eur(totalCA)}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gold" />
            </div>
          </div>
        </Card>
        <Card className="p-5 border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Frais Prestataires</p>
              <p className="text-2xl md:text-3xl font-display text-foreground mt-1">{eur(totalFrais)}</p>
              <p className="text-xs text-muted-foreground mt-1">Marge : <span className="text-emerald-400">{eur(totalCA - totalFrais)}</span></p>
            </div>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>

      {/* Clients */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-lg font-display text-gradient-gold">Factures clients</h3>
          <Dialog open={openClient} onOpenChange={setOpenClient}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-gold text-primary-foreground"><Plus className="w-4 h-4" /> Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvelle facture client</DialogTitle></DialogHeader>
              <form onSubmit={submitClient} className="space-y-3">
                <div><Label>Client</Label><Input required value={clientForm.client_name} onChange={(e) => setClientForm({ ...clientForm, client_name: e.target.value })} /></div>
                <div><Label>N° Facture</Label><Input value={clientForm.invoice_number} onChange={(e) => setClientForm({ ...clientForm, invoice_number: e.target.value })} /></div>
                <div><Label>Montant (€)</Label><Input type="number" step="0.01" required value={clientForm.amount} onChange={(e) => setClientForm({ ...clientForm, amount: e.target.value })} /></div>
                <div><Label>Échéance</Label><Input type="date" value={clientForm.due_date} onChange={(e) => setClientForm({ ...clientForm, due_date: e.target.value })} /></div>
                <div>
                  <Label>Statut</Label>
                  <Select value={clientForm.status} onValueChange={(v) => setClientForm({ ...clientForm, status: v as InvStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground">Créer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Client</TableHead><TableHead>N°</TableHead><TableHead>Montant</TableHead><TableHead>Émise</TableHead><TableHead>Échéance</TableHead><TableHead>Statut</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {clientInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.client_name}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.invoice_number ?? "—"}</TableCell>
                  <TableCell className="text-gold font-semibold">{eur(Number(inv.amount))}</TableCell>
                  <TableCell>{inv.issued_at}</TableCell>
                  <TableCell>{inv.due_date ?? "—"}</TableCell>
                  <TableCell>
                    <Select value={inv.status} onValueChange={(v) => updateClientStatus(inv.id, v as InvStatus)}>
                      <SelectTrigger className={`h-7 w-[110px] border ${statusBadge[inv.status]}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => remove("client_invoices", inv.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
              {clientInvoices.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Aucune facture</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Vendors */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-lg font-display text-gradient-gold">Factures prestataires</h3>
          <Dialog open={openVendor} onOpenChange={setOpenVendor}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-gold text-primary-foreground"><Plus className="w-4 h-4" /> Ajouter</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouvelle facture prestataire</DialogTitle></DialogHeader>
              <form onSubmit={submitVendor} className="space-y-3">
                <div><Label>Prestataire</Label><Input required value={vendorForm.vendor_name} onChange={(e) => setVendorForm({ ...vendorForm, vendor_name: e.target.value })} /></div>
                <div><Label>N° Facture</Label><Input value={vendorForm.invoice_number} onChange={(e) => setVendorForm({ ...vendorForm, invoice_number: e.target.value })} /></div>
                <div><Label>Montant (€)</Label><Input type="number" step="0.01" required value={vendorForm.amount} onChange={(e) => setVendorForm({ ...vendorForm, amount: e.target.value })} /></div>
                <div><Label>Date de règlement prévue</Label><Input type="date" value={vendorForm.scheduled_payment_date} onChange={(e) => setVendorForm({ ...vendorForm, scheduled_payment_date: e.target.value })} /></div>
                <div>
                  <Label>Statut</Label>
                  <Select value={vendorForm.status} onValueChange={(v) => setVendorForm({ ...vendorForm, status: v as InvStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground">Créer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Prestataire</TableHead><TableHead>N°</TableHead><TableHead>Montant</TableHead><TableHead>Reçue</TableHead><TableHead>Règlement prévu</TableHead><TableHead>Statut</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {vendorInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.vendor_name}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.invoice_number ?? "—"}</TableCell>
                  <TableCell className="text-foreground font-semibold">{eur(Number(inv.amount))}</TableCell>
                  <TableCell>{inv.received_at}</TableCell>
                  <TableCell>{inv.scheduled_payment_date ?? "—"}</TableCell>
                  <TableCell>
                    <Select value={inv.status} onValueChange={(v) => updateVendorStatus(inv.id, v as InvStatus)}>
                      <SelectTrigger className={`h-7 w-[110px] border ${statusBadge[inv.status]}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => remove("vendor_invoices", inv.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
              {vendorInvoices.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">Aucune facture</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}