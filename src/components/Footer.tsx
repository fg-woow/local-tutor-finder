import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Learnnear</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find the right face-to-face teacher near you in minutes.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">For Students</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/tutors" className="text-sm text-muted-foreground hover:text-foreground">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">For Tutors</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/become-tutor" className="text-sm text-muted-foreground hover:text-foreground">
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Tutor Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Support</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  help@learnnear.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Learnnear. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
