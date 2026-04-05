import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type UserRole = "student" | "tutor";

export interface LocalUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  subjects: string[];
  location: string | null;
  hourly_rate: number | null;
  experience: string | null;
  availability: string[];
  education: string | null;
  certificates: string[];
  course_topics: string[];
  teaching_levels: string[];
  intro_video_url: string | null;
  suitable_for: string[];
  created_at: string;
}

interface AuthContextType {
  user: LocalUser | null;
  role: UserRole | null;
  profile: LocalUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<LocalUser>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = "learnnear_users";
const CURRENT_USER_KEY = "learnnear_current_user";

function getStoredUsers(): Record<string, LocalUser & { password: string }> {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredUsers(users: Record<string, LocalUser & { password: string }>) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

function setCurrentUserId(id: string | null) {
  if (id) {
    localStorage.setItem(CURRENT_USER_KEY, id);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if a user is already logged in
  useEffect(() => {
    const userId = getCurrentUserId();
    if (userId) {
      const users = getStoredUsers();
      const storedUser = users[userId];
      if (storedUser) {
        const { password: _, ...userData } = storedUser;
        setUser(userData);
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const users = getStoredUsers();

    // Check if email is already registered
    const existingUser = Object.values(users).find((u) => u.email === email);
    if (existingUser) {
      return { error: new Error("This email is already registered") };
    }

    const id = crypto.randomUUID ? crypto.randomUUID() : `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const newUser: LocalUser & { password: string } = {
      id,
      email,
      password,
      full_name: fullName,
      role,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0d9488&color=fff&size=200`,
      bio: null,
      subjects: [],
      location: null,
      hourly_rate: null,
      experience: null,
      availability: [],
      education: null,
      certificates: [],
      course_topics: [],
      teaching_levels: [],
      intro_video_url: null,
      suitable_for: [],
      created_at: new Date().toISOString(),
    };

    users[id] = newUser;
    saveStoredUsers(users);
    setCurrentUserId(id);

    const { password: _, ...userData } = newUser;
    setUser(userData);

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const users = getStoredUsers();
    const found = Object.values(users).find((u) => u.email === email && u.password === password);

    if (!found) {
      return { error: new Error("Invalid login credentials") };
    }

    setCurrentUserId(found.id);
    const { password: _, ...userData } = found;
    setUser(userData);

    return { error: null };
  };

  const signOut = async () => {
    setCurrentUserId(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<LocalUser>) => {
    if (!user) return { error: new Error("Not authenticated") };

    const users = getStoredUsers();
    const storedUser = users[user.id];
    if (!storedUser) return { error: new Error("User not found") };

    const updatedUser = { ...storedUser, ...updates };
    users[user.id] = updatedUser;
    saveStoredUsers(users);

    const { password: _, ...userData } = updatedUser;
    setUser(userData);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        profile: user,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
