import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Users, Baby, HandHeart, Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Agape Safety Nest Logo" className="h-12 w-auto" />
            <span className="text-xl font-semibold text-foreground">Agape Safety Nest LLC</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors">Services</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
            <Link to="/admin">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Faith-Based Transitional Housing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            A Safe Haven for <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Women in Need</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Providing safe, supportive housing for expectant mothers, women who have lost children, women re-entering society after incarceration, and women experiencing homelessness - empowering them to rebuild their lives with dignity and support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/onboarding">
              <Button size="lg" className="w-full sm:w-auto">
                Begin Your Journey
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Agape Safety Nest LLC exists to provide a safe, nurturing, and stable home environment for expectant mothers and women with guaranteed income. Our mission is to offer compassionate support, dignified housing, and essential life resources that empower women to rebuild their lives, restore self-worth, and achieve long-term stability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Faith-Based Care</h3>
                <p className="text-muted-foreground text-center">
                  Rooted in Christian values of unconditional love, compassion, and service to those in need.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Safe Environment</h3>
                <p className="text-muted-foreground text-center">
                  A secure, nurturing home where mothers and children can rebuild their lives free from crisis.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                  <HandHeart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Holistic Support</h3>
                <p className="text-muted-foreground text-center">
                  Comprehensive services addressing physical, emotional, spiritual, and practical needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Founder</h2>
          </div>
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="rounded-full bg-primary/10 w-32 h-32 flex items-center justify-center flex-shrink-0">
                  <Users className="h-16 w-16 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Robin Belinda Mitchell</h3>
                  <p className="text-primary font-semibold mb-4">Founder & Director</p>
                  <p className="text-muted-foreground mb-4">
                    Agape Safety Nest LLC was founded by Robin Belinda Mitchell, a compassionate leader with a vision to create a safe and supportive housing environment for vulnerable women. Ms. Mitchell brings deep empathy and a strong sense of mission to helping women in need, particularly expectant mothers and those who have experienced the trauma of losing a child, rebuild their lives through stability, care, and respect.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground justify-center md:justify-start">
                    <span>📞 (910) 527-3673</span>
                    <span className="hidden sm:inline">•</span>
                    <span>📍 San Antonio, TX 78223</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Who We Serve</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Agape Safety Nest welcomes women ages 18 and older who have a guaranteed income source and are seeking stable housing and supportive care.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <Baby className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Expectant Mothers</h3>
                <p className="text-muted-foreground">
                  Pregnant women seeking a stable and supportive environment during pregnancy and early motherhood, with access to prenatal and postnatal care resources.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <Heart className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Women Who Have Lost Children</h3>
                <p className="text-muted-foreground">
                  Women who have lost custody of their children or experienced child loss, providing emotional support and a path toward healing and stability.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Women Re-entering Society</h3>
                <p className="text-muted-foreground">
                  Women transitioning after incarceration who need safe housing and support to reintegrate successfully into their communities.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <Home className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Women Experiencing Homelessness</h3>
                <p className="text-muted-foreground">
                  Women facing housing instability or homelessness who have guaranteed income (SSI, SSDI, VA benefits, or pensions) and are motivated to rebuild their lives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What We Offer</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive support services designed to empower mothers and ensure the wellbeing of their children.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
              <Home className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Private & Semi-Private Rooms</h3>
              <p className="text-muted-foreground">
                Comfortable, furnished living spaces with utilities included (electricity, water, internet, climate control).
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
              <Baby className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nutritious Meals & Services</h3>
              <p className="text-muted-foreground">
                Three daily meals, laundry services, and all essential amenities for comfortable living.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Life Skills Training</h3>
              <p className="text-muted-foreground">
                Financial literacy, job readiness, and independent living skills to prepare for self-sufficiency.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
              <Heart className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Emotional Support</h3>
              <p className="text-muted-foreground">
                Counseling referrals, peer support groups, and a compassionate community environment.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
              <HandHeart className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Spiritual Guidance</h3>
              <p className="text-muted-foreground">
                Optional faith-based counseling, prayer support, and connection to local faith communities.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Case Management</h3>
              <p className="text-muted-foreground">
                Individualized support plans, resource navigation, and advocacy to achieve personal goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ background: "var(--gradient-primary)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">Ready to Take the Next Step?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Whether you're seeking help or want to support our mission, we're here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/onboarding">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Onboarding
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-4 bg-white border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Agape Safety Nest" className="h-10 w-auto" />
              </div>
              <p className="text-sm text-muted-foreground">
                Providing safe, compassionate housing and support for mothers and children.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground mb-2">San Antonio, TX 78223</p>
              <p className="text-sm text-muted-foreground mb-2">Phone: (910) 527-3673</p>
              <p className="text-sm text-muted-foreground">Email: info@agapesafetynest.org</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link to="/onboarding" className="text-sm text-muted-foreground hover:text-primary">Begin Onboarding</Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Form</Link>
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">Admin Portal</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Agape Safety Nest LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;