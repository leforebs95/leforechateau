-- Create tables
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    number_of_guests INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.pricing_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    price_multiplier DECIMAL(3, 2) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_dates ON public.blocked_dates(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_dates ON public.pricing_rules(start_date, end_date);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
    ON public.bookings FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for blocked_dates (admin only)
CREATE POLICY "Only admins can manage blocked dates"
    ON public.blocked_dates FOR ALL
    USING (auth.uid() IN (
        SELECT user_id FROM public.admin_users
    ));

-- Policies for reviews
CREATE POLICY "Anyone can view reviews"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for pricing_rules (admin only)
CREATE POLICY "Anyone can view pricing rules"
    ON public.pricing_rules FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage pricing rules"
    ON public.pricing_rules FOR ALL
    USING (auth.uid() IN (
        SELECT user_id FROM public.admin_users
    ));

-- Policies for admin_users (admin only)
CREATE POLICY "Only admins can manage admin users"
    ON public.admin_users FOR ALL
    USING (auth.uid() IN (
        SELECT user_id FROM public.admin_users
    ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for bookings
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 