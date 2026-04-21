-- ================================================
-- Migration: Add reviews and bookings tables
-- Run this in Supabase SQL Editor if not using CLI
-- ================================================

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tutor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(tutor_id, student_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tutor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_date date NOT NULL,
    time_slot text NOT NULL,
    hourly_rate numeric(10,2) NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on both tables
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Reviews RLS Policies
-- ==========================================
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = student_id);

-- ==========================================
-- Bookings RLS Policies
-- ==========================================
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = tutor_id OR auth.uid() = student_id);

CREATE POLICY "Authenticated users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = tutor_id);

-- ==========================================
-- Triggers
-- ==========================================
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
