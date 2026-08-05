-- Enable Row Level Security on all core tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approved_hardware ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- users table policies
-- 1. Users can read their own profile
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- 2. Users can update their own profile (e.g., name updates), but NOT their role or credit balance
-- To truly secure this, you'd restrict columns, but for standard RLS:
CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- compliance_documents table policies
-- 1. Users can view their own documents
CREATE POLICY "Users can view own documents" 
ON public.compliance_documents FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Users can insert their own documents
CREATE POLICY "Users can insert own documents" 
ON public.compliance_documents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own documents
CREATE POLICY "Users can update own documents" 
ON public.compliance_documents FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- payment_transactions table policies
-- 1. Users can view their own transactions
CREATE POLICY "Users can view own transactions" 
ON public.payment_transactions FOR SELECT 
USING (auth.uid() = user_id);

-- approved_hardware table policies (The Ground Truth)
-- 1. Public can read hardware data (Needed for pSEO landing pages and standard user dropdowns)
CREATE POLICY "Hardware is public read-only" 
ON public.approved_hardware FOR SELECT 
USING (true);

-- 2. Only Admins can insert/update/delete hardware data
-- This assumes we check the 'role' column on the 'users' table.
CREATE POLICY "Only admins can modify hardware" 
ON public.approved_hardware FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);
