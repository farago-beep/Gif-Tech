import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function AdminAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin");
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Compte créé. Demandez à un admin de vous attribuer le rôle.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connexion réussie");
        navigate("/admin");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero p-4">
      <Card className="w-full max-w-md p-8 border-border/60 bg-card/80 backdrop-blur">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center mb-3 shadow-gold">
            <Lock className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display text-gradient-gold">Espace Admin GiF</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Connectez-vous pour accéder au dashboard" : "Créez votre compte administrateur"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
            {loading ? "Patientez..." : mode === "login" ? "Se connecter" : "Créer le compte"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 text-xs text-muted-foreground hover:text-primary w-full text-center"
        >
          {mode === "login" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
        </button>
      </Card>
    </div>
  );
}