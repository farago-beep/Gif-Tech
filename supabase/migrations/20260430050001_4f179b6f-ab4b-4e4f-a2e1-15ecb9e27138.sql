-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ENUMS
CREATE TYPE public.project_stage AS ENUM ('Onboarding', 'Audit', 'Dev', 'Test', 'Livraison');
CREATE TYPE public.project_status AS ENUM ('À faire', 'En cours', 'Bloqué', 'Terminé');
CREATE TYPE public.invoice_status AS ENUM ('Payé', 'En attente');
CREATE TYPE public.contact_type AS ENUM ('client', 'prestataire');

-- PROJECTS
CREATE TABLE public.admin_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  stage project_stage NOT NULL DEFAULT 'Onboarding',
  manager TEXT,
  status project_status NOT NULL DEFAULT 'À faire',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage projects" ON public.admin_projects FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_admin_projects_updated BEFORE UPDATE ON public.admin_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CLIENT INVOICES
CREATE TABLE public.client_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  invoice_number TEXT,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status invoice_status NOT NULL DEFAULT 'En attente',
  issued_at DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage client invoices" ON public.client_invoices FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_client_invoices_updated BEFORE UPDATE ON public.client_invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- VENDOR INVOICES
CREATE TABLE public.vendor_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  invoice_number TEXT,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status invoice_status NOT NULL DEFAULT 'En attente',
  received_at DATE NOT NULL DEFAULT CURRENT_DATE,
  scheduled_payment_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vendor_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage vendor invoices" ON public.vendor_invoices FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_vendor_invoices_updated BEFORE UPDATE ON public.vendor_invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CONTACTS
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type contact_type NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  drive_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage contacts" ON public.contacts FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_contacts_updated BEFORE UPDATE ON public.contacts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();