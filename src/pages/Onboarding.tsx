import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";

const Onboarding = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pregnancyStatus: "",
    currentSituation: "",
    needsDescription: "",
    referralSource: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('onboarding_requests')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            pregnancy_status: formData.pregnancyStatus || null,
            current_situation: formData.currentSituation,
            needs_description: formData.needsDescription,
            referral_source: formData.referralSource || null,
            status: 'Pending Review',
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Request Submitted Successfully",
        description: "We've received your information and will reach out within 24-48 hours.",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        pregnancyStatus: "",
        currentSituation: "",
        needsDescription: "",
        referralSource: "",
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-border bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Agape Safety Nest Logo" className="h-12 w-auto" />
            <span className="text-xl font-semibold text-primary">Agape Safety Nest LLC</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Onboarding Form */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Begin Your Journey</h1>
          <p className="text-lg text-muted-foreground">
            Share your information with us so we can connect with you and provide the support you need. We'll reach out within 24-48 hours to welcome you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Agape Safety Nest</CardTitle>
            <CardDescription>
              All information is confidential and helps us understand how we can best support you on your journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pregnancyStatus">Pregnancy Status</Label>
                <Input
                  id="pregnancyStatus"
                  name="pregnancyStatus"
                  value={formData.pregnancyStatus}
                  onChange={handleChange}
                  placeholder="e.g., 20 weeks pregnant, not pregnant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSituation">Current Living Situation *</Label>
                <Textarea
                  id="currentSituation"
                  name="currentSituation"
                  value={formData.currentSituation}
                  onChange={handleChange}
                  required
                  placeholder="Please describe your current housing and living situation"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="needsDescription">How Can We Help You? *</Label>
                <Textarea
                  id="needsDescription"
                  name="needsDescription"
                  value={formData.needsDescription}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your specific needs and what kind of support you're looking for"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralSource">How Did You Hear About Us?</Label>
                <Input
                  id="referralSource"
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  placeholder="e.g., Friend, Social worker, Website, Church"
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Next Steps:</strong> After you submit this form, we'll reach out within 24-48 hours to welcome you, answer any questions, and help you take the next steps toward a safe and supportive home.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Connect With Us"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need immediate assistance? Call us at <span className="font-semibold text-foreground">(910) 527-3673</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;