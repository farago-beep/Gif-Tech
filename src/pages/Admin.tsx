import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, ShieldAlert } from "lucide-react";
import ProjectsTab from "@/components/admin/ProjectsTab";
import FinanceTab from "@/components/admin/FinanceTab";
import ContactsTab from "@/components/admin/ContactsTab";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/admin/auth");
    });
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/auth");
        return;
      }
      setUserId(data.session.user.id);
      setEmail(data.session.user.email ?? "");
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      setLoading(false);
    })();
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnecté");
    navigate("/admin/auth");
  };

  const claimAdmin = async () => {
    if (!userId) return;
    // Server-side guard: claim_first_admin atomically grants admin only if no admin exists yet.
    const { data, error } = await supabase.rpc("claim_first_admin" as never);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data === true) {
      toast.success("Vous êtes maintenant administrateur");
      setIsAdmin(true);
    } else {
      toast.error("Un administrateur existe déjà. Demandez-lui de vous ajouter.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-display text-gradient-gold mb-2">Accès restreint</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Votre compte ({email}) n'a pas le rôle administrateur.
          </p>
          <div className="space-y-2">
            <Button onClick={claimAdmin} className="w-full bg-gradient-gold text-primary-foreground">
              Réclamer le rôle admin (1er utilisateur)
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              Se déconnecter
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur sticky top-0 z-30">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl md:text-2xl font-display text-gradient-gold">Dashboard GiF</h1>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>
      </header>

      <main className="container py-6 md:py-10">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
            <TabsTrigger value="projects">Suivi Clients</TabsTrigger>
            <TabsTrigger value="finance">Facturation</TabsTrigger>
            <TabsTrigger value="contacts">Base de données</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="mt-6">
            <ProjectsTab />
          </TabsContent>
          <TabsContent value="finance" className="mt-6">
            <FinanceTab />
          </TabsContent>
          <TabsContent value="contacts" className="mt-6">
            <ContactsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}