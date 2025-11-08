import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const Onboarding = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    childrenCount: "",
    pregnancyStatus: "",
    currentSituation: "",
    needsDescription: "",
    referralSource: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create email body
    const emailBody = `
New Onboarding Request - Agape Safety Nest

Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Number of Children: ${formData.childrenCount}
Pregnancy Status: ${formData.pregnancyStatus}
Current Situation: ${formData.currentSituation}
Needs Description: ${formData.needsDescription}
How They Heard About Us: ${formData.referralSource}
    `.trim();

    // Open email client
    window.location.href = `mailto:info@agapesafetynest.org?subject=Onboarding Request - ${formData.fullName}&body=${encodeURIComponent(emailBody)}`;
    
    toast({
      title: "Opening Email Client",
      description: "Please send the email to complete your request.",
    });
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
            Complete this form to start the onboarding process. We'll review your information and contact you within 24-48 hours.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding Application</CardTitle>
            <CardDescription>
              All information is confidential and will be used only to assess how we can best serve you.
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="childrenCount">Number of Children</Label>
                  <Input
                    id="childrenCount"
                    name="childrenCount"
                    type="number"
                    min="0"
                    value={formData.childrenCount}
                    onChange={handleChange}
                    placeholder="0"
                  />
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
                  <strong>Next Steps:</strong> After submitting this form, our team will review your information. 
                  We'll contact you within 24-48 hours to discuss your situation, answer questions, and guide you through the next steps.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Application
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