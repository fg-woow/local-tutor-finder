import { motion } from "framer-motion";
import { Users, DollarSign, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const BecomeTutor = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  // If user is already a tutor, redirect to profile edit
  if (user && role === "tutor") {
    navigate("/profile/edit");
    return null;
  }

  const benefits = [
    {
      icon: Users,
      title: "Reach Local Students",
      description: "Connect with students in your area actively looking for tutors.",
    },
    {
      icon: DollarSign,
      title: "Set Your Own Rates",
      description: "You decide how much to charge for your expertise and time.",
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description: "Work when you want. Accept lessons that fit your availability.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-hero py-16 md:py-20">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="mb-4 inline-block rounded-full bg-secondary-light px-4 py-1.5 text-sm font-medium text-secondary">
                Join our tutor network
              </span>
              <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
                Share your knowledge,<br />
                <span className="text-primary">inspire students</span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Join Learnnear and connect with students in your area who need your expertise.
                Set your own schedule and rates.
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">Get Started as a Tutor</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-8 md:grid-cols-3"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border bg-card p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-muted/50 py-16">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Ready to start teaching?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
                Create your free tutor profile in minutes and start connecting with students today.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link to="/signup">Sign up as a Tutor</Link>
                </Button>
                {user && role === "student" && (
                  <p className="text-sm text-muted-foreground">
                    Already have a student account? Contact support to switch to a tutor account.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BecomeTutor;
