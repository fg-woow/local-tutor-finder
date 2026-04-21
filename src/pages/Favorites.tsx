import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, MapPin, Clock, Search, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { getFavoriteTutorProfiles, toggleFavorite } from "@/lib/api";
import type { Profile } from "@/lib/api";

const Favorites = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favoriteTutors, setFavoriteTutors] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      setIsLoading(true);
      const { data } = await getFavoriteTutorProfiles(user.id);
      setFavoriteTutors(data as Profile[]);
      setIsLoading(false);
    };
    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (tutorId: string, tutorName: string) => {
    if (!user) return;
    const { error } = await toggleFavorite(user.id, tutorId);
    if (!error) {
      setFavoriteTutors((prev) => prev.filter((t) => t.user_id !== tutorId));
      toast({
        title: "Removed from favorites",
        description: `${tutorName} has been removed from your favorites.`,
      });
    }
  };

  if (authLoading) {
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
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-7 w-7 text-red-500 fill-red-500" />
                <h1 className="text-3xl font-bold text-foreground">Favorite Tutors</h1>
              </div>
              <p className="text-muted-foreground">
                Your saved tutors — quickly access profiles you're interested in
              </p>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex gap-4 animate-pulse">
                        <div className="h-16 w-16 rounded-xl bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-muted rounded" />
                          <div className="h-3 w-24 bg-muted rounded" />
                          <div className="h-3 w-48 bg-muted rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : favoriteTutors.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card>
                  <CardContent className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20">
                      <Heart className="h-10 w-10 text-red-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      No favorites yet
                    </h3>
                    <p className="mb-6 text-muted-foreground max-w-sm mx-auto">
                      Browse tutors and tap the heart icon to save them to your favorites list for quick access later.
                    </p>
                    <Button asChild>
                      <Link to="/tutors">
                        <Search className="mr-2 h-4 w-4" />
                        Browse Tutors
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <AnimatePresence>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {favoriteTutors.map((tutor, index) => (
                    <motion.div
                      key={tutor.user_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                                <AvatarImage
                                  src={
                                    tutor.avatar_url ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      tutor.full_name
                                    )}&background=0d9488&color=fff`
                                  }
                                />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                  {tutor.full_name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {tutor.full_name}
                                </h3>
                                {tutor.location && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {tutor.location}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveFavorite(tutor.user_id, tutor.full_name)
                              }
                              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Remove from favorites"
                            >
                              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                            </button>
                          </div>

                          {/* Subjects */}
                          {tutor.subjects && tutor.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {tutor.subjects.slice(0, 3).map((subject) => (
                                <Badge key={subject} variant="subject" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                              {tutor.subjects.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{tutor.subjects.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex items-center justify-between text-sm mb-4">
                            {tutor.experience && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{tutor.experience}</span>
                              </div>
                            )}
                            {tutor.hourly_rate && (
                              <span className="font-semibold text-foreground">
                                ${tutor.hourly_rate}/hr
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <Button className="w-full" size="sm" asChild>
                            <Link to={`/tutors/${tutor.user_id}`}>
                              View Profile
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
