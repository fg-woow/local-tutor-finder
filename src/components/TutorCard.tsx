import { Star, MapPin, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tutor } from "@/data/tutors";

interface TutorCardProps {
  tutor: Tutor;
}

const isNewTutor = (createdAt?: string): boolean => {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return created > thirtyDaysAgo;
};

const TutorCard = ({ tutor }: TutorCardProps) => {
  const isNew = isNewTutor(tutor.createdAt);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Avatar Section */}
          <div className="relative h-48 w-full overflow-hidden sm:h-auto sm:w-40 sm:min-h-[200px]">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {isNew && (
              <Badge variant="new" className="absolute top-2 left-2 gap-1">
                <Sparkles className="h-3 w-3" />
                New
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{tutor.name}</h3>
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{tutor.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-semibold text-foreground">{tutor.rating}</span>
                <span className="text-xs text-muted-foreground">({tutor.reviewCount})</span>
              </div>
            </div>

            {/* Subjects */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {tutor.subjects.map((subject) => (
                <Badge key={subject} variant="subject">
                  {subject}
                </Badge>
              ))}
              {tutor.studentLevel?.map((level) => (
                <Badge key={level} variant="level">
                  {level}
                </Badge>
              ))}
            </div>

            {/* Bio */}
            <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
              {tutor.bio}
            </p>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{tutor.experience}</span>
                </div>
                <span className="font-semibold text-foreground">
                  ${tutor.hourlyRate}/hr
                </span>
              </div>
              <Button size="sm" asChild className="transition-transform duration-200 hover:scale-105">
                <Link to={`/tutors/${tutor.id}`}>View Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorCard;
