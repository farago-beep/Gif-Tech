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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, ExternalLink, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type ContactType = Database["public"]["Enums"]["contact_type"];

export default function ContactsTab() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "client" as ContactType, name: "", email: "", phone: "", drive_link: "" });

  const load = async () => {
    const { data, error } = await supabase.from("contacts").select("*").order("name");
    if (error) toast.error(error.message);
    else setContacts(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("contacts").insert({
      type: form.type,
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      drive_link: form.drive_link || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Contact ajouté");
    setOpen(false);
    setForm({ type: "client", name: "", email: "", phone: "", drive_link: "" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce contact ?")) return;
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setContacts((p) => p.filter((c) => c.id !== id));
  };

  const renderTable = (filter: ContactType) => {
    const list = contacts.filter((c) => c.type === filter);
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Nom</TableHead><TableHead>Email</TableHead><TableHead>Téléphone</TableHead><TableHead>Drive</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {list.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>
                  {c.email ? (
                    <a href={`mailto:${c.email}`} className="text-cyan hover:underline inline-flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {c.email}
                    </a>
                  ) : "—"}
                </TableCell>
                <TableCell>
                  {c.phone ? (
                    <a href={`tel:${c.phone}`} className="text-foreground hover:text-gold inline-flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {c.phone}
                    </a>
                  ) : "—"}
                </TableCell>
                <TableCell>
                  {c.drive_link ? (
                    <a href={c.drive_link} target="_blank" rel="noopener" className="text-gold hover:underline inline-flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Ouvrir
                    </a>
                  ) : "—"}
                </TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
              </TableRow>
            ))}
            {list.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">Aucun contact</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg md:text-xl font-display text-gradient-gold">Répertoire</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-gold text-primary-foreground"><Plus className="w-4 h-4" /> Ajouter un contact</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau contact</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as ContactType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="prestataire">Prestataire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Nom</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Téléphone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Lien Drive</Label><Input type="url" value={form.drive_link} onChange={(e) => setForm({ ...form, drive_link: e.target.value })} /></div>
              <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground">Créer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="client">
        <TabsList>
          <TabsTrigger value="client">Clients</TabsTrigger>
          <TabsTrigger value="prestataire">Prestataires</TabsTrigger>
        </TabsList>
        <TabsContent value="client" className="mt-4">{renderTable("client")}</TabsContent>
        <TabsContent value="prestataire" className="mt-4">{renderTable("prestataire")}</TabsContent>
      </Tabs>
    </Card>
  );
}