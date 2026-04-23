import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionHistory from "@/components/SessionHistory";
import { useAuth } from "@/hooks/useAuth";

const Bookings = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-8">
        <div className="container max-w-5xl">
          <h1 className="text-3xl font-bold mb-6 text-foreground">My Bookings</h1>
          <SessionHistory />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bookings;
