export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  location: string;
  bio: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: string[];
  experience: string;
  createdAt?: string;
  studentLevel?: string[];
  reviews?: Review[];
}

export const studentLevels = [
  "Primary School",
  "Middle School",
  "High School",
  "University",
  "Adult Learner",
];

export const priceRanges = [
  { label: "Under $30/hr", min: 0, max: 30 },
  { label: "$30-50/hr", min: 30, max: 50 },
  { label: "$50-75/hr", min: 50, max: 75 },
  { label: "Over $75/hr", min: 75, max: 999 },
];

export const mockTutors: Tutor[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    subjects: ["Mathematics", "Physics"],
    location: "Manhattan, NY",
    bio: "Passionate math teacher with 8 years of experience helping students excel. I specialize in making complex concepts simple and engaging.",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 45,
    availability: ["Weekdays", "Evenings"],
    experience: "8 years",
    reviews: [
      {
        id: "r1",
        studentName: "Alice Johnson",
        rating: 5,
        comment: "Sarah is an amazing tutor! She helped me pass my Calculus exam with flying colors.",
        date: "2024-03-10"
      },
      {
        id: "r2",
        studentName: "Mike Peters",
        rating: 5,
        comment: "Very patient and clear explanations. Highly recommended.",
        date: "2024-02-15"
      }
    ]
  },
  {
    id: "2",
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    subjects: ["Chemistry", "Biology"],
    location: "Brooklyn, NY",
    bio: "Former research scientist turned educator. I bring real-world applications to every lesson to make science come alive.",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 50,
    availability: ["Weekends", "Mornings"],
    experience: "6 years",
    reviews: [
      {
        id: "r3",
        studentName: "Tom Wilson",
        rating: 5,
        comment: "Great chemistry tutor. I finally understand organic chemistry.",
        date: "2024-01-20"
      }
    ]
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    subjects: ["English", "Literature", "Writing"],
    location: "Queens, NY",
    bio: "Published author and English teacher. I help students find their voice and develop strong communication skills.",
    rating: 5.0,
    reviewCount: 156,
    hourlyRate: 40,
    availability: ["Flexible"],
    experience: "10 years"
  },
  {
    id: "4",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    subjects: ["Computer Science", "Programming"],
    location: "San Francisco, CA",
    bio: "Software engineer at a top tech company. I teach coding fundamentals to advanced algorithms with hands-on projects.",
    rating: 4.9,
    reviewCount: 94,
    hourlyRate: 65,
    availability: ["Evenings", "Weekends"],
    experience: "5 years"
  },
  {
    id: "5",
    name: "Lisa Park",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    subjects: ["Korean", "Japanese"],
    location: "Los Angeles, CA",
    bio: "Native Korean speaker with Japanese fluency. I make language learning fun through cultural immersion and conversation practice.",
    rating: 4.7,
    reviewCount: 72,
    hourlyRate: 35,
    availability: ["Weekdays", "Mornings"],
    experience: "4 years"
  },
  {
    id: "6",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    subjects: ["History", "Geography"],
    location: "Chicago, IL",
    bio: "History professor with a knack for storytelling. I bring the past to life and help students understand how it shapes our present.",
    rating: 4.8,
    reviewCount: 63,
    hourlyRate: 42,
    availability: ["Afternoons", "Weekends"],
    experience: "12 years"
  }
];

export const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Literature",
  "Writing",
  "Computer Science",
  "Programming",
  "History",
  "Geography",
  "Korean",
  "Japanese",
  "Spanish",
  "French",
  "Music",
  "Art"
];

export const locations = [
  "Manhattan, NY",
  "Brooklyn, NY",
  "Queens, NY",
  "San Francisco, CA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Boston, MA",
  "Seattle, WA"
];

export const availabilityOptions = [
  "Weekdays",
  "Weekends",
  "Mornings",
  "Afternoons",
  "Evenings",
  "Flexible"
];
