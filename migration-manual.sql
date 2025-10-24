-- Migration manuelle pour ajouter les champs professionnels
-- À exécuter dans Supabase SQL Editor

-- Ajouter les nouveaux champs au tableau users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS "jobTitle" TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS "emailNotifications" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr';

-- Créer un index sur username pour améliorer les performances
CREATE UNIQUE INDEX IF NOT EXISTS users_username_key ON users(username) WHERE username IS NOT NULL;

