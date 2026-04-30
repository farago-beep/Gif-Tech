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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["admin_projects"]["Row"];
type Stage = Database["public"]["Enums"]["project_stage"];
type Status = Database["public"]["Enums"]["project_status"];

const STAGES: Stage[] = ["Onboarding", "Audit", "Dev", "Test", "Livraison"];
const STATUSES: Status[] = ["À faire", "En cours", "Bloqué", "Terminé"];

const statusColor: Record<Status, string> = {
  "À faire": "bg-muted-foreground/30 text-foreground",
  "En cours": "bg-cyan/20 text-cyan border border-cyan/40",
  "Bloqué": "bg-destructive/20 text-destructive border border-destructive/40",
  "Terminé": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
};

const stageColor: Record<Stage, string> = {
  Onboarding: "bg-blue-500/15 text-blue-300",
  Audit: "bg-purple-500/15 text-purple-300",
  Dev: "bg-gold/20 text-gold",
  Test: "bg-amber-500/15 text-amber-300",
  Livraison: "bg-emerald-500/15 text-emerald-300",
};

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    client_name: "",
    project_name: "",
    stage: "Onboarding" as Stage,
    manager: "",
    status: "À faire" as Status,
  });

  const load = async () => {
    const { data, error } = await supabase
      .from("admin_projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setProjects(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const updateField = async (id: string, field: "stage" | "status", value: string) => {
    const payload = field === "stage" ? { stage: value as Stage } : { status: value as Status };
    const { error } = await supabase.from("admin_projects").update(payload).eq("id", id);
    if (error) toast.error(error.message);
    else {
      setProjects((p) => p.map((x) => (x.id === id ? { ...x, [field]: value as never } : x)));
    }
  };

  const removeProject = async (id: string) => {
    if (!confirm("Supprimer ce projet ?")) return;
    const { error } = await supabase.from("admin_projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else setProjects((p) => p.filter((x) => x.id !== id));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("admin_projects").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Projet ajouté");
    setOpen(false);
    setForm({ client_name: "", project_name: "", stage: "Onboarding", manager: "", status: "À faire" });
    load();
  };

  return (
    <Card className="p-4 md:p-6 bg-card/60 border-border/60">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-lg md:text-xl font-display text-gradient-gold">Suivi des projets clients</h2>
          <p className="text-xs text-muted-foreground">{projects.length} projet(s)</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90">
              <Plus className="w-4 h-4" /> Ajouter un projet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau projet</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-3">
              <div><Label>Nom du client</Label><Input required value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} /></div>
              <div><Label>Projet</Label><Input required value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} /></div>
              <div>
                <Label>Étape</Label>
                <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v as Stage })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Responsable</Label><Input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} /></div>
              <div>
                <Label>Statut</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground">Créer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Étape</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.client_name}</TableCell>
                <TableCell>{p.project_name}</TableCell>
                <TableCell>
                  <Select value={p.stage} onValueChange={(v) => updateField(p.id, "stage", v)}>
                    <SelectTrigger className={`h-8 w-[130px] border-0 ${stageColor[p.stage]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{p.manager ?? "—"}</TableCell>
                <TableCell>
                  <Select value={p.status} onValueChange={(v) => updateField(p.id, "status", v)}>
                    <SelectTrigger className={`h-8 w-[130px] border-0 ${statusColor[p.status]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => removeProject(p.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucun projet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}