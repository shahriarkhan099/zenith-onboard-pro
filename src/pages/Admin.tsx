import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, FileText, Settings, AlertCircle, Phone, Mail, Calendar, Baby, Plus, Filter, Edit, Trash2, X, Search, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import logo from "@/assets/logo.png";

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [user, setUser] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [contactFilter, setContactFilter] = useState<string>("all");
  const [residentFilter, setResidentFilter] = useState<string>("all");
  const [residentSearch, setResidentSearch] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<any>(null);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [editRequestStatus, setEditRequestStatus] = useState<string>("");
  const [editResidentStatus, setEditResidentStatus] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(12);
  const [contactEmail, setContactEmail] = useState<string>("info@agapesafetynest.org");
  const [newResident, setNewResident] = useState({
    name: "",
    email: "",
    phone: "",
    children: "",
    ages: "",
    moveInDate: "",
    expectedExit: "",
    caseManager: "Robin Mitchell"
  });

  // Check authentication state on mount
  useEffect(() => {
    const allowedEmail = "rbm@agapesafetynest.org";
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Only allow the authorized email
      if (session?.user?.email?.toLowerCase() === allowedEmail) {
        setUser(session.user);
      } else if (session?.user) {
        // If logged in with wrong email, sign out
        supabase.auth.signOut();
        setUser(null);
      } else {
        setUser(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only allow the authorized email
      if (session?.user?.email?.toLowerCase() === allowedEmail) {
        setUser(session.user);
      } else if (session?.user) {
        // If logged in with wrong email, sign out
        supabase.auth.signOut();
        setUser(null);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize email to lowercase for comparison
    const normalizedEmail = loginData.email.toLowerCase().trim();
    const allowedEmail = "rbm@agapesafetynest.org";
    
    // Check if email matches the allowed admin email
    if (normalizedEmail !== allowedEmail) {
      toast({
        title: "Access Denied",
        description: "Only authorized administrators can access this portal.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: loginData.password,
      });

      if (error) throw error;
      
      // Double check the user email matches
      if (data.user?.email?.toLowerCase() !== allowedEmail) {
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "Only authorized administrators can access this portal.",
          variant: "destructive",
        });
        return;
      }
      
      setUser(data.user);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard.",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Fetch settings
  const { data: settings = null } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      
      if (error) {
        console.error('Settings fetch error:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user,
  });

  // Update capacity and contact email from settings when loaded
  useEffect(() => {
    if (settings) {
      setCapacity(settings.capacity || 12);
      setContactEmail(settings.contact_email || "info@agapesafetynest.org");
    }
  }, [settings]);

  // Fetch onboarding requests (excluding resolved ones)
  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['onboarding-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_requests')
        .select('*')
        .or('resolved.eq.false,resolved.is.null');

      if (error) throw error;
      // Sort by updated_at DESC, then created_at DESC (newest first)
      return (data || []).sort((a: any, b: any) => {
        const aDate = new Date(a.updated_at || a.created_at).getTime();
        const bDate = new Date(b.updated_at || b.created_at).getTime();
        return bDate - aDate;
      });
    },
    enabled: !!user,
  });

  // Fetch contact submissions (with resolved field)
  const { data: contactSubmissions = [], isLoading: contactLoading } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*');

      if (error) throw error;
      // Sort by created_at DESC (newest first) - contact submissions don't have updated_at
      return (data || []).sort((a: any, b: any) => {
        const aDate = new Date(a.created_at).getTime();
        const bDate = new Date(b.created_at).getTime();
        return bDate - aDate;
      });
    },
    enabled: !!user,
  });

  // Fetch residents
  const { data: residents = [], isLoading: residentsLoading } = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('residents')
        .select('*');

      if (error) throw error;
      // Sort by updated_at DESC, then created_at DESC (newest first)
      return (data || []).sort((a: any, b: any) => {
        const aDate = new Date(a.updated_at || a.created_at).getTime();
        const bDate = new Date(b.updated_at || b.created_at).getTime();
        return bDate - aDate;
      });
    },
    enabled: !!user,
  });

  // Add resident mutation
  const addResidentMutation = useMutation({
    mutationFn: async (residentData: any) => {
      const { data, error } = await supabase
        .from('residents')
        .insert([{
          name: residentData.name,
          email: residentData.email || null,
          phone: residentData.phone || null,
          children_count: residentData.children && residentData.children.trim() !== '' 
            ? parseInt(residentData.children) 
            : 0,
          children_ages: residentData.ages && residentData.ages.trim() !== '' 
            ? residentData.ages 
            : null,
          move_in_date: residentData.moveInDate,
          expected_exit_date: residentData.expectedExit || null,
          case_manager: residentData.caseManager,
          status: 'Active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      setIsAddResidentOpen(false);
      setNewResident({
        name: "",
        email: "",
        phone: "",
        children: "",
        ages: "",
        moveInDate: "",
        expectedExit: "",
        caseManager: "Robin Mitchell"
      });
      toast({
        title: "Resident Added",
        description: "The new resident has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add resident.",
        variant: "destructive",
      });
    },
  });

  const handleAddResident = () => {
    if (!newResident.name || !newResident.moveInDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    addResidentMutation.mutate(newResident);
  };

  // Resolve onboarding request mutation
  const resolveOnboardingMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('onboarding_requests')
        .update({ resolved: true, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-requests'] });
      toast({
        title: "Request Resolved",
        description: "The onboarding request has been marked as resolved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resolve request.",
        variant: "destructive",
      });
    },
  });


  // Update onboarding request status mutation
  const updateOnboardingStatusMutation = useMutation({
    mutationFn: async ({ requestId, status, requestData }: { requestId: string; status: string; requestData?: any }) => {
      // Update the onboarding request status
      const { error: updateError } = await supabase
        .from('onboarding_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If status is "Approved", automatically create an active resident
      if (status === "Approved" && requestData) {
        // Check if resident already exists for this person
        const { data: existingResident, error: checkError } = await supabase
          .from('residents')
          .select('id')
          .eq('name', requestData.full_name)
          .limit(1);

        // If the check query failed, throw error instead of proceeding
        if (checkError) throw checkError;

        // Only create if resident doesn't exist
        if (!existingResident || existingResident.length === 0) {
          const moveInDate = new Date().toISOString().split('T')[0]; // Today's date
          const expectedExitDate = new Date();
          expectedExitDate.setMonth(expectedExitDate.getMonth() + 6); // 6 months from now
          const expectedExitDateStr = expectedExitDate.toISOString().split('T')[0];

          const { data: newResident, error: residentError } = await supabase
            .from('residents')
            .insert([{
              name: requestData.full_name,
              email: requestData.email || null,
              phone: requestData.phone || null,
              children_count: requestData.children_count || 0,
              children_ages: null, // Not available from onboarding form
              move_in_date: moveInDate,
              expected_exit_date: expectedExitDateStr,
              case_manager: "Robin Mitchell", // Default case manager
              status: 'Active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }])
            .select();

          if (residentError) {
            console.error('Error creating resident:', residentError);
            throw new Error(`Failed to create resident: ${residentError.message}`);
          }

          if (newResident && newResident.length > 0) {
            console.log('Resident created successfully:', newResident[0]);
          }
        } else {
          console.log('Resident already exists for:', requestData.full_name);
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-requests'] });
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      
      if (variables.status === "Approved") {
        toast({
          title: "Request Approved & Resident Created",
          description: "The onboarding request has been approved and a new resident has been added.",
        });
      } else {
        toast({
          title: "Status Updated",
          description: "The request status has been updated.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  // Delete mutations
  const deleteOnboardingMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { data, error } = await supabase
        .from('onboarding_requests')
        .delete()
        .eq('id', requestId)
        .select();

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No rows were deleted. The record may not exist or you may not have permission.');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-requests'] });
      toast({
        title: "Deleted",
        description: "The onboarding request has been permanently deleted from the database.",
      });
    },
    onError: (error: any) => {
      console.error('Delete onboarding error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete request. Please check your permissions.",
        variant: "destructive",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', submissionId)
        .select();

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No rows were deleted. The record may not exist or you may not have permission.');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({
        title: "Deleted",
        description: "The contact submission has been permanently deleted from the database.",
      });
    },
    onError: (error: any) => {
      console.error('Delete contact error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete submission. Please check your permissions.",
        variant: "destructive",
      });
    },
  });

  const deleteResidentMutation = useMutation({
    mutationFn: async (residentId: string) => {
      const { error } = await supabase
        .from('residents')
        .delete()
        .eq('id', residentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      toast({
        title: "Deleted",
        description: "The resident has been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete resident.",
        variant: "destructive",
      });
    },
  });

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (settingsData: { capacity: number; contact_email: string }) => {
      // Use upsert to insert or update
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          id: 1, // Single row for settings
          capacity: settingsData.capacity,
          contact_email: settingsData.contact_email,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    },
  });

  // Resolve contact submission mutation
  const resolveContactMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ resolved: true })
        .eq('id', submissionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({
        title: "Submission Resolved",
        description: "The contact submission has been marked as resolved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resolve submission.",
        variant: "destructive",
      });
    },
  });

  // Update mutations for editing
  const updateOnboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      // Get the current request to check if status is changing to Approved
      const { data: currentRequest, error: fetchError } = await supabase
        .from('onboarding_requests')
        .select('status')
        .eq('id', data.id)
        .single();

      // If the fetch query failed, throw error instead of proceeding
      if (fetchError) throw fetchError;

      const wasApproved = currentRequest?.status === "Approved";
      const isBeingApproved = data.status === "Approved" && !wasApproved;

      // Update the onboarding request
      const { error } = await supabase
        .from('onboarding_requests')
        .update({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          children_count: data.children_count ? parseInt(data.children_count) : null,
          pregnancy_status: data.pregnancy_status || null,
          current_situation: data.current_situation,
          needs_description: data.needs_description,
          referral_source: data.referral_source || null,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id);

      if (error) throw error;

      // If status is being changed to "Approved", create a resident (if one doesn't already exist)
      if (isBeingApproved) {
        // Check if resident already exists for this person
        const { data: existingResident, error: checkError } = await supabase
          .from('residents')
          .select('id')
          .eq('name', data.full_name)
          .limit(1);

        // If the check query failed, throw error instead of proceeding
        if (checkError) throw checkError;

        // Only create if resident doesn't exist
        if (!existingResident || existingResident.length === 0) {
          const moveInDate = new Date().toISOString().split('T')[0]; // Today's date
          const expectedExitDate = new Date();
          expectedExitDate.setMonth(expectedExitDate.getMonth() + 6); // 6 months from now
          const expectedExitDateStr = expectedExitDate.toISOString().split('T')[0];

          const { error: residentError } = await supabase
            .from('residents')
            .insert([{
              name: data.full_name,
              email: data.email || null,
              phone: data.phone || null,
              children_count: data.children_count ? parseInt(data.children_count) : 0,
              children_ages: null, // Not available from onboarding form
              move_in_date: moveInDate,
              expected_exit_date: expectedExitDateStr,
              case_manager: "Robin Mitchell", // Default case manager
              status: 'Active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }]);

          if (residentError) throw residentError;
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-requests'] });
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      setEditingRequest(null);
      
      if (variables.status === "Approved") {
        toast({
          title: "Updated & Resident Created",
          description: "The onboarding request has been updated and a new resident has been added.",
        });
      } else {
        toast({
          title: "Updated",
          description: "The onboarding request has been updated.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update request.",
        variant: "destructive",
      });
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      setEditingContact(null);
      toast({
        title: "Updated",
        description: "The contact submission has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update submission.",
        variant: "destructive",
      });
    },
  });

  const updateResidentMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('residents')
        .update({
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          children_count: parseInt(data.children_count),
          children_ages: data.children_ages || null,
          move_in_date: data.move_in_date,
          expected_exit_date: data.expected_exit_date || null,
          case_manager: data.case_manager,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
      setEditingResident(null);
      toast({
        title: "Updated",
        description: "The resident has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update resident.",
        variant: "destructive",
      });
    },
  });

  const filteredRequests = statusFilter === "all" 
    ? requests 
    : requests.filter((r: any) => r.status === statusFilter);

  const filteredContacts = contactFilter === "all"
    ? contactSubmissions
    : contactSubmissions.filter((c: any) => {
        if (contactFilter === "resolved") return c.resolved === true;
        if (contactFilter === "not-resolved") return c.resolved === false || c.resolved === null;
        return true;
      });

  // Filter residents by status and search term (name, email, and phone)
  const filteredResidents = residents.filter((resident: any) => {
    // Filter by status
    if (residentFilter !== "all") {
      const statusMatch = resident.status?.toLowerCase() === residentFilter.toLowerCase();
      if (!statusMatch) return false;
    }
    
    // Filter by search term
    if (residentSearch.trim() !== "") {
      const searchTerm = residentSearch.toLowerCase().trim();
      const nameMatch = resident.name?.toLowerCase().includes(searchTerm);
      const emailMatch = resident.email?.toLowerCase().includes(searchTerm);
      const phoneMatch = resident.phone?.toLowerCase().includes(searchTerm);
      if (!(nameMatch || emailMatch || phoneMatch)) return false;
    }
    
    return true;
  });

  if (!user) {
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

        {/* Login Form */}
        <div className="container mx-auto px-4 py-20 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>Sign in to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Sign in with your admin credentials to access the dashboard.
                </AlertDescription>
              </Alert>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    placeholder="rbm@agapesafetynest.org"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-border bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Agape Safety Nest Logo" className="h-12 w-auto" />
            <span className="text-xl font-semibold text-primary">Agape Safety Nest LLC</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage onboarding requests and resident information</p>
        </div>

        {requestsLoading || residentsLoading || contactLoading ? (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Loading data...</AlertDescription>
          </Alert>
        ) : null}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardDescription>Onboarding Requests</CardDescription>
              <CardTitle className="text-3xl">{requests.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardDescription>Contact Submissions</CardDescription>
              <CardTitle className="text-3xl">{contactSubmissions.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardDescription>Pending Review</CardDescription>
              <CardTitle className="text-3xl">{requests.filter((r: any) => r.status === "Pending Review").length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardDescription>Active Residents</CardDescription>
              <CardTitle className="text-3xl">{residents.filter((r: any) => r.status === "Active").length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardDescription>Capacity</CardDescription>
              <CardTitle className="text-3xl">{residents.filter((r: any) => r.status === "Active").length}/{capacity}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">
              <FileText className="h-4 w-4 mr-2" />
              Onboarding Requests
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Mail className="h-4 w-4 mr-2" />
              Contact Submissions
            </TabsTrigger>
            <TabsTrigger value="residents">
              <Users className="h-4 w-4 mr-2" />
              Current Residents
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Label>Filter by Status:</Label>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Requests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {requestsLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Loading requests...</p>
                </CardContent>
              </Card>
            ) : filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No requests found.</p>
                </CardContent>
              </Card>
            ) : (
              filteredRequests.map((request: any) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{request.full_name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Baby className="h-3 w-3" />
                            {request.children_count || 0} {request.children_count === 1 ? 'child' : 'children'}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={request.status === "Approved" ? "default" : request.status === "Pending Review" ? "secondary" : "outline"}>
                        {request.status === "Approved" ? "Approved" : request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{request.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{request.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Pregnancy Status:</p>
                        <p className="text-sm text-muted-foreground">{request.pregnancy_status || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">Current Situation:</p>
                      <p className="text-sm text-muted-foreground">{request.current_situation}</p>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">Needs Description:</p>
                      <p className="text-sm text-muted-foreground">{request.needs_description}</p>
                    </div>
                    {request.referral_source && (
                      <div className="pt-2">
                        <p className="text-sm font-medium mb-1">Referral Source:</p>
                        <p className="text-sm text-muted-foreground">{request.referral_source}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2 flex-wrap">
                      {request.status !== "Approved" && (
                        <Button 
                          size="sm" 
                          onClick={() => {
                            const newStatus = request.status === "Pending Review" ? "Under Review" : "Approved";
                            updateOnboardingStatusMutation.mutate({ 
                              requestId: request.id, 
                              status: newStatus,
                              requestData: newStatus === "Approved" ? request : undefined
                            });
                          }}
                          disabled={updateOnboardingStatusMutation.isPending}
                        >
                          {request.status === "Pending Review" ? "Mark as Under Review" : 
                           request.status === "Under Review" ? "Mark as Approved" : 
                           "Review Application"}
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        asChild
                      >
                        <a href={`mailto:${request.email}?subject=Re: Onboarding Request - ${encodeURIComponent(request.full_name)}`}>
                          Contact Applicant
                        </a>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingRequest(request);
                          setEditRequestStatus(request.status);
                        }}
                        className="border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={deleteOnboardingMutation.isPending}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the onboarding request for {request.full_name}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteOnboardingMutation.mutate(request.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Label>Filter:</Label>
              </div>
              <Select value={contactFilter} onValueChange={setContactFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Submissions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Submissions</SelectItem>
                  <SelectItem value="not-resolved">Not Resolved</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {contactLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Loading contact submissions...</p>
                </CardContent>
              </Card>
            ) : filteredContacts.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No contact submissions found.</p>
                </CardContent>
              </Card>
            ) : (
              filteredContacts.map((submission: any) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{submission.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {submission.email}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={submission.resolved ? "default" : "outline"}>
                        {submission.resolved ? "Resolved" : "Contact Form"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{submission.email}</span>
                        </div>
                        {submission.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{submission.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Subject:</p>
                        <p className="text-sm text-muted-foreground">{submission.subject}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">Message:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{submission.message}</p>
                    </div>
                    <div className="flex gap-2 pt-2 flex-wrap">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`mailto:${submission.email}?subject=Re: ${encodeURIComponent(submission.subject)}`}>
                          Reply via Email
                        </a>
                      </Button>
                      {submission.phone && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${submission.phone}`}>Call</a>
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingContact(submission)}
                        className="border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={deleteContactMutation.isPending}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the contact submission from {submission.name}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteContactMutation.mutate(submission.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveContactMutation.mutate(submission.id)}
                        disabled={resolveContactMutation.isPending || submission.resolved}
                      >
                        {submission.resolved ? "Resolved" : "Resolve"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="residents" className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Label>Filter by Status:</Label>
              </div>
              <Select value={residentFilter} onValueChange={setResidentFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Residents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Residents</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Moved Out">Moved Out</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={residentSearch}
                    onChange={(e) => setResidentSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Dialog open={isAddResidentOpen} onOpenChange={setIsAddResidentOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Resident
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Resident</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new resident to add them to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="resident-name">Full Name *</Label>
                        <Input
                          id="resident-name"
                          value={newResident.name}
                          onChange={(e) => setNewResident({...newResident, name: e.target.value})}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resident-children">Number of Children</Label>
                        <Input
                          id="resident-children"
                          type="number"
                          value={newResident.children}
                          onChange={(e) => setNewResident({...newResident, children: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="resident-email">Email</Label>
                        <Input
                          id="resident-email"
                          type="email"
                          value={newResident.email}
                          onChange={(e) => setNewResident({...newResident, email: e.target.value})}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resident-phone">Phone Number</Label>
                        <Input
                          id="resident-phone"
                          type="tel"
                          value={newResident.phone}
                          onChange={(e) => setNewResident({...newResident, phone: e.target.value})}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="resident-ages">Children Ages</Label>
                        <Input
                          id="resident-ages"
                          value={newResident.ages}
                          onChange={(e) => setNewResident({...newResident, ages: e.target.value})}
                          placeholder="e.g., 5, 3, 1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resident-movein">Move-in Date *</Label>
                        <Input
                          id="resident-movein"
                          type="date"
                          value={newResident.moveInDate}
                          onChange={(e) => setNewResident({...newResident, moveInDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="resident-exit">Expected Exit Date</Label>
                        <Input
                          id="resident-exit"
                          type="date"
                          value={newResident.expectedExit}
                          onChange={(e) => setNewResident({...newResident, expectedExit: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="resident-manager">Case Manager</Label>
                        <Input
                          id="resident-manager"
                          value={newResident.caseManager}
                          onChange={(e) => setNewResident({...newResident, caseManager: e.target.value})}
                          placeholder="Case manager name"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleAddResident}
                        disabled={!newResident.name || !newResident.moveInDate || addResidentMutation.isPending}
                      >
                        {addResidentMutation.isPending ? "Adding..." : "Add Resident"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddResidentOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {residentsLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Loading residents...</p>
                </CardContent>
              </Card>
            ) : filteredResidents.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {residentSearch.trim() ? `No residents found matching "${residentSearch}"` : "No residents found."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredResidents.map((resident: any) => (
                <Card key={resident.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{resident.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Baby className="h-3 w-3" />
                            {resident.children_count || 0} {resident.children_count === 1 ? 'child' : 'children'}
                            {resident.children_ages && ` (Ages: ${resident.children_ages})`}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Move-in: {resident.move_in_date ? new Date(resident.move_in_date).toLocaleDateString() : "Not set"}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={resident.status === "Active" ? "default" : "secondary"}>
                        {resident.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{resident.email || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{resident.phone || "Not provided"}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Case Manager:</p>
                        <p className="text-sm text-muted-foreground">{resident.case_manager || "Not assigned"}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Move-in Date:</p>
                        <p className="text-sm text-muted-foreground">
                          {resident.move_in_date 
                            ? new Date(resident.move_in_date).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Expected Exit Date:</p>
                        <p className="text-sm text-muted-foreground">
                          {resident.expected_exit_date 
                            ? new Date(resident.expected_exit_date).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingResident(resident);
                          setEditResidentStatus(resident.status);
                        }}
                        className="border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={deleteResidentMutation.isPending}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the resident record for {resident.name}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteResidentMutation.mutate(resident.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure dashboard preferences and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveSettingsMutation.mutate({
                      capacity: capacity,
                      contact_email: contactEmail,
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="font-semibold mb-2">Facility Information</h3>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="capacity">Current Capacity</Label>
                        <Input 
                          id="capacity"
                          type="number" 
                          min="1"
                          value={capacity}
                          onChange={(e) => setCapacity(parseInt(e.target.value) || 12)}
                          className="mt-1" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input 
                          id="contact-email"
                          type="email" 
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="mt-1" 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={saveSettingsMutation.isPending}
                    >
                      {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Onboarding Request Dialog */}
      <Dialog open={!!editingRequest} onOpenChange={(open) => !open && setEditingRequest(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Onboarding Request</DialogTitle>
            <DialogDescription>Update the details of this onboarding request.</DialogDescription>
          </DialogHeader>
          {editingRequest && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                updateOnboardingMutation.mutate({
                  id: editingRequest.id,
                  full_name: formData.get('full_name') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  children_count: formData.get('children_count') as string,
                  pregnancy_status: formData.get('pregnancy_status') as string,
                  current_situation: formData.get('current_situation') as string,
                  needs_description: formData.get('needs_description') as string,
                  referral_source: formData.get('referral_source') as string,
                  status: editRequestStatus,
                });
              }}
              className="space-y-4 pt-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-full_name">Full Name *</Label>
                  <Input id="edit-full_name" name="full_name" defaultValue={editingRequest.full_name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={editingRequest.email} required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone *</Label>
                  <Input id="edit-phone" name="phone" defaultValue={editingRequest.phone} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-children_count">Number of Children</Label>
                  <Input id="edit-children_count" name="children_count" type="number" defaultValue={editingRequest.children_count || ''} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pregnancy_status">Pregnancy Status</Label>
                  <Input id="edit-pregnancy_status" name="pregnancy_status" defaultValue={editingRequest.pregnancy_status || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select value={editRequestStatus} onValueChange={setEditRequestStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending Review">Pending Review</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-current_situation">Current Situation *</Label>
                <Textarea id="edit-current_situation" name="current_situation" defaultValue={editingRequest.current_situation} required rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-needs_description">Needs Description *</Label>
                <Textarea id="edit-needs_description" name="needs_description" defaultValue={editingRequest.needs_description} required rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-referral_source">Referral Source</Label>
                <Input id="edit-referral_source" name="referral_source" defaultValue={editingRequest.referral_source || ''} />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={updateOnboardingMutation.isPending}>
                  {updateOnboardingMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingRequest(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Contact Submission Dialog */}
      <Dialog open={!!editingContact} onOpenChange={(open) => !open && setEditingContact(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Contact Submission</DialogTitle>
            <DialogDescription>Update the details of this contact submission.</DialogDescription>
          </DialogHeader>
          {editingContact && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                updateContactMutation.mutate({
                  id: editingContact.id,
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  subject: formData.get('subject') as string,
                  message: formData.get('message') as string,
                });
              }}
              className="space-y-4 pt-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-name">Name *</Label>
                  <Input id="edit-contact-name" name="name" defaultValue={editingContact.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-email">Email *</Label>
                  <Input id="edit-contact-email" name="email" type="email" defaultValue={editingContact.email} required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-phone">Phone</Label>
                  <Input id="edit-contact-phone" name="phone" defaultValue={editingContact.phone || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-subject">Subject *</Label>
                  <Input id="edit-contact-subject" name="subject" defaultValue={editingContact.subject} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact-message">Message *</Label>
                <Textarea id="edit-contact-message" name="message" defaultValue={editingContact.message} required rows={6} />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={updateContactMutation.isPending}>
                  {updateContactMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingContact(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Resident Dialog */}
      <Dialog open={!!editingResident} onOpenChange={(open) => !open && setEditingResident(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resident</DialogTitle>
            <DialogDescription>Update the details of this resident.</DialogDescription>
          </DialogHeader>
          {editingResident && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                updateResidentMutation.mutate({
                  id: editingResident.id,
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  children_count: formData.get('children_count') as string,
                  children_ages: formData.get('children_ages') as string,
                  move_in_date: formData.get('move_in_date') as string,
                  expected_exit_date: formData.get('expected_exit_date') as string,
                  case_manager: formData.get('case_manager') as string,
                  status: editResidentStatus,
                });
              }}
              className="space-y-4 pt-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-resident-name">Full Name *</Label>
                  <Input id="edit-resident-name" name="name" defaultValue={editingResident.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-resident-children">Number of Children *</Label>
                  <Input id="edit-resident-children" name="children_count" type="number" defaultValue={editingResident.children_count} required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-resident-email">Email</Label>
                  <Input id="edit-resident-email" name="email" type="email" defaultValue={editingResident.email || ''} placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-resident-phone">Phone Number</Label>
                  <Input id="edit-resident-phone" name="phone" type="tel" defaultValue={editingResident.phone || ''} placeholder="(123) 456-7890" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-resident-ages">Children Ages</Label>
                  <Input id="edit-resident-ages" name="children_ages" defaultValue={editingResident.children_ages || ''} placeholder="e.g., 5, 3, 1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-resident-movein">Move-in Date *</Label>
                  <Input id="edit-resident-movein" name="move_in_date" type="date" defaultValue={editingResident.move_in_date} required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-resident-exit">Expected Exit Date</Label>
                  <Input id="edit-resident-exit" name="expected_exit_date" type="date" defaultValue={editingResident.expected_exit_date || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-resident-manager">Case Manager *</Label>
                  <Input id="edit-resident-manager" name="case_manager" defaultValue={editingResident.case_manager} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-resident-status">Status *</Label>
                <Select value={editResidentStatus} onValueChange={setEditResidentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Moved Out">Moved Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={updateResidentMutation.isPending}>
                  {updateResidentMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingResident(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;