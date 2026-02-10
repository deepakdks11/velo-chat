"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProfileSetup from "@/components/auth/ProfileSetup";
import RoomList from "@/components/rooms/RoomList";
import Loading from "@/components/ui/loading";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FeatureGrid from "@/components/landing/FeatureGrid";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const { user, profile, loading, login, createProfile } = useAuth();
  const [init, setInit] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<{ nickname: string, gender: 'male' | 'female' | 'other', country: string } | null>(null);

  useEffect(() => {
    if (!loading) {
      setInit(true);
    }
  }, [loading]);

  useEffect(() => {
    if (user && pendingProfile && !profile) {
      const initProfile = async () => {
        try {
          await createProfile(pendingProfile.nickname, pendingProfile.gender, pendingProfile.country);
        } catch (error) {
          console.error("Error creating profile:", error);
        } finally {
          setPendingProfile(null);
        }
      };
      initProfile();
    }
  }, [user, pendingProfile, profile, createProfile]);

  const handleGuestLogin = async (data: { nickname: string, gender: 'male' | 'female' | 'other', country: string }) => {
    setPendingProfile(data);
    await login();
  };

  if (!init) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="Initializing VeloChat..." />
      </div>
    );
  }

  // Handling auto-profile creation state
  if (user && pendingProfile && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="Setting up your profile..." />
      </div>
    );
  }

  // Not authenticated -> Show landing/login
  if (!user) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <Hero onGuestLogin={handleGuestLogin} loading={loading} />
        <FeatureGrid />
        <Footer />
      </main>
    );
  }

  // Authenticated but no profile -> Show setup
  if (!profile) {
    return <ProfileSetup />;
  }

  // Authenticated and profile set -> Show rooms
  return (
    <main className="min-h-screen bg-background pb-12 pt-6">
      <RoomList />
    </main>
  );
}
