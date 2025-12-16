import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, X, ArrowUpDown, Star, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TutorCard from "@/components/TutorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { mockTutors, subjects, studentLevels, priceRanges, availabilityOptions } from "@/data/tutors";
import { supabase } from "@/integrations/supabase/client";

interface TutorProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  subjects: string[];
  location: string | null;
  hourly_rate: number | null;
  experience: string | null;
  availability: string[];
  created_at: string;
}

type SortOption = "rating" | "price-low" | "price-high" | "newest" | "location";

const Tutors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [subjectFilter, setSubjectFilter] = useState(searchParams.get("subject") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
  const [selectedStudentLevels, setSelectedStudentLevels] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [dbTutors, setDbTutors] = useState<TutorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .not("subjects", "eq", "{}");

      if (!error && data) {
        const tutorProfiles = data.filter(
          (p) => p.subjects && p.subjects.length > 0
        ) as TutorProfile[];
        setDbTutors(tutorProfiles);
      }
      setIsLoading(false);
    };

    fetchTutors();
  }, []);

  // Combine mock tutors with database tutors
  const allTutors = useMemo(() => {
    const dbTutorCards = dbTutors.map((t) => ({
      id: t.user_id,
      name: t.full_name,
      avatar: t.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.full_name)}&background=0d9488&color=fff`,
      subjects: t.subjects,
      location: t.location || "Location not set",
      bio: t.bio || "No bio yet",
      rating: 5.0,
      reviewCount: 0,
      hourlyRate: t.hourly_rate || 0,
      availability: t.availability,
      experience: t.experience || "New tutor",
      createdAt: t.created_at,
      studentLevel: [] as string[],
    }));

    const mockWithDates = mockTutors.map((t) => ({
      ...t,
      createdAt: undefined,
      studentLevel: ["High School", "University"] as string[],
    }));

    return [...dbTutorCards, ...mockWithDates];
  }, [dbTutors]);

  const filteredAndSortedTutors = useMemo(() => {
    let result = allTutors.filter((tutor) => {
      const matchesSubject = !subjectFilter ||
        tutor.subjects.some((s) =>
          s.toLowerCase().includes(subjectFilter.toLowerCase())
        );
      const matchesLocation = !locationFilter ||
        tutor.location.toLowerCase().includes(locationFilter.toLowerCase());

      // Price range filter
      let matchesPrice = true;
      if (selectedPriceRange.length > 0) {
        matchesPrice = selectedPriceRange.some((rangeLabel) => {
          const range = priceRanges.find((r) => r.label === rangeLabel);
          if (!range) return false;
          return tutor.hourlyRate >= range.min && tutor.hourlyRate < range.max;
        });
      }

      // Student level filter
      let matchesLevel = true;
      if (selectedStudentLevels.length > 0) {
        matchesLevel = selectedStudentLevels.some((level) =>
          tutor.studentLevel?.includes(level)
        );
      }

      // Availability filter
      let matchesAvailability = true;
      if (selectedAvailability.length > 0) {
        matchesAvailability = selectedAvailability.some((option) =>
          tutor.availability?.includes(option)
        );
      }

      return matchesSubject && matchesLocation && matchesPrice && matchesLevel && matchesAvailability;
    });

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price-high":
        result.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "newest":
        result.sort((a, b) => {
          if (!a.createdAt && !b.createdAt) return 0;
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
      case "location":
        result.sort((a, b) => a.location.localeCompare(b.location));
        break;
    }

    return result;
  }, [allTutors, subjectFilter, locationFilter, sortBy, selectedPriceRange, selectedStudentLevels]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (subjectFilter) params.set("subject", subjectFilter);
    if (locationFilter) params.set("location", locationFilter);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSubjectFilter("");
    setLocationFilter("");
    setSelectedPriceRange([]);
    setSelectedStudentLevels([]);
    setSelectedAvailability([]);
    setSearchParams({});
  };

  const togglePriceRange = (range: string) => {
    setSelectedPriceRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const toggleStudentLevel = (level: string) => {
    setSelectedStudentLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const toggleAvailability = (option: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };


  const hasFilters = subjectFilter || locationFilter || selectedPriceRange.length > 0 || selectedStudentLevels.length > 0 || selectedAvailability.length > 0;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h4 className="mb-3 font-semibold text-foreground">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.label} className="flex items-center space-x-2">
              <Checkbox
                id={range.label}
                checked={selectedPriceRange.includes(range.label)}
                onCheckedChange={() => togglePriceRange(range.label)}
              />
              <Label htmlFor={range.label} className="text-sm cursor-pointer">
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Student Level */}
      <div>
        <h4 className="mb-3 font-semibold text-foreground">Student Level</h4>
        <div className="space-y-2">
          {studentLevels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={level}
                checked={selectedStudentLevels.includes(level)}
                onCheckedChange={() => toggleStudentLevel(level)}
              />
              <Label htmlFor={level} className="text-sm cursor-pointer">
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="mb-3 font-semibold text-foreground">Availability</h4>
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={selectedAvailability.includes(option)}
                onCheckedChange={() => toggleAvailability(option)}
              />
              <Label htmlFor={option} className="text-sm cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30">
        {/* Header */}
        <section className="border-b bg-card py-8">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="mb-2 text-3xl font-bold text-foreground">Find Tutors</h1>
              <p className="text-muted-foreground">
                Browse our network of qualified local tutors
              </p>
            </motion.div>

            {/* Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by subject..."
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Filters</span>
                      {(selectedPriceRange.length > 0 || selectedStudentLevels.length > 0 || selectedAvailability.length > 0) && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                          {selectedPriceRange.length + selectedStudentLevels.length + selectedAvailability.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters */}
            {hasFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 flex flex-wrap items-center gap-2"
              >
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {subjectFilter && (
                  <Badge variant="subject" className="gap-1">
                    {subjectFilter}
                    <button onClick={() => setSubjectFilter("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {locationFilter && (
                  <Badge variant="location" className="gap-1">
                    {locationFilter}
                    <button onClick={() => setLocationFilter("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedPriceRange.map((range) => (
                  <Badge key={range} variant="outline" className="gap-1">
                    <DollarSign className="h-3 w-3" />
                    {range}
                    <button onClick={() => togglePriceRange(range)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedStudentLevels.map((level) => (
                  <Badge key={level} variant="level" className="gap-1">
                    {level}
                    <button onClick={() => toggleStudentLevel(level)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Quick Subject Filters */}
        <section className="border-b bg-card/50 py-4">
          <div className="container">
            <div className="flex flex-wrap gap-2">
              {subjects.slice(0, 8).map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSubjectFilter(subject)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${subjectFilter === subject
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                    }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-muted-foreground">
                {isLoading ? (
                  "Loading tutors..."
                ) : (
                  <>
                    <span className="font-semibold text-foreground">{filteredAndSortedTutors.length}</span>{" "}
                    tutors found
                  </>
                )}
              </p>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Highest Rated
                      </div>
                    </SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="location">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location (A-Z)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : filteredAndSortedTutors.length > 0 ? (
              <motion.div
                initial="initial"
                animate="animate"
                variants={{
                  animate: {
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="grid gap-6"
              >
                {filteredAndSortedTutors.map((tutor) => (
                  <motion.div key={tutor.id} variants={fadeInUp}>
                    <TutorCard tutor={tutor} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border bg-card py-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">No tutors found</h3>
                <p className="mb-6 text-muted-foreground">
                  Try adjusting your search filters or browse all tutors
                </p>
                <Button onClick={clearFilters}>Clear filters</Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tutors;