import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, FileText, Settings, AlertCircle, Phone, Mail, Calendar, Baby, Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import logo from "@/assets/logo.png";

const Admin = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [newResident, setNewResident] = useState({
    name: "",
    children: "",
    ages: "",
    moveInDate: "",
    expectedExit: "",
    caseManager: "Robin Mitchell"
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary demo login
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
    }
  };

  // Mock data for dashboard
  const mockRequests = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 123-4567",
      children: 2,
      pregnancy: "28 weeks",
      status: "Pending Review",
      date: "2024-11-05",
      situation: "Currently staying with friend, lease ending soon"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      email: "maria.r@email.com",
      phone: "(555) 234-5678",
      children: 1,
      pregnancy: "Not pregnant",
      status: "Under Review",
      date: "2024-11-03",
      situation: "Recently left domestic violence situation"
    },
    {
      id: 3,
      name: "Jennifer Williams",
      email: "j.williams@email.com",
      phone: "(555) 345-6789",
      children: 0,
      pregnancy: "16 weeks",
      status: "Approved",
      date: "2024-11-01",
      situation: "Homeless, currently in shelter"
    }
  ];

  const mockResidents = [
    {
      id: 1,
      name: "Lisa Anderson",
      children: 3,
      ages: "5, 3, 1",
      moveInDate: "2024-09-15",
      expectedExit: "2025-03-15",
      caseManager: "Robin Mitchell"
    },
    {
      id: 2,
      name: "Amanda Brown",
      children: 1,
      ages: "6 months",
      moveInDate: "2024-10-01",
      expectedExit: "2025-04-01",
      caseManager: "Robin Mitchell"
    }
  ];

  if (!isLoggedIn) {
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
                  Backend integration needed for authentication. This is a demo interface.
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
                    placeholder="admin@agapesafetynest.org"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    placeholder="••••••••"
                  />
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
            <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
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

        <Alert className="mb-6 bg-muted/50 border-primary/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode:</strong> Showing static data. Enable backend integration to manage live data.
          </AlertDescription>
        </Alert>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-3xl">{mockRequests.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardDescription>Pending Review</CardDescription>
              <CardTitle className="text-3xl">{mockRequests.filter(r => r.status === "Pending Review").length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardDescription>Active Residents</CardDescription>
              <CardTitle className="text-3xl">{mockResidents.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardDescription>Capacity</CardDescription>
              <CardTitle className="text-3xl">{mockResidents.length}/12</CardTitle>
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

            {mockRequests
              .filter(request => statusFilter === "all" || request.status === statusFilter)
              .map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{request.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {request.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Baby className="h-3 w-3" />
                          {request.children} {request.children === 1 ? 'child' : 'children'}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant={request.status === "Approved" ? "default" : request.status === "Pending Review" ? "secondary" : "outline"}>
                      {request.status}
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
                      <p className="text-sm text-muted-foreground">{request.pregnancy}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-1">Current Situation:</p>
                    <p className="text-sm text-muted-foreground">{request.situation}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm">Review Application</Button>
                    <Button size="sm" variant="outline">Contact Applicant</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="residents" className="space-y-4">
            <div className="flex justify-end mb-6">
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
                        <Label htmlFor="resident-children">Number of Children *</Label>
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
                        onClick={() => {
                          // In production, this would save to backend
                          console.log("Adding resident:", newResident);
                          setIsAddResidentOpen(false);
                          setNewResident({
                            name: "",
                            children: "",
                            ages: "",
                            moveInDate: "",
                            expectedExit: "",
                            caseManager: "Robin Mitchell"
                          });
                        }}
                        disabled={!newResident.name || !newResident.children || !newResident.moveInDate}
                      >
                        Add Resident
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddResidentOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {mockResidents.map((resident) => (
              <Card key={resident.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{resident.name}</CardTitle>
                      <CardDescription>
                        {resident.children} {resident.children === 1 ? 'child' : 'children'} (Ages: {resident.ages})
                      </CardDescription>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Move-in Date</p>
                      <p className="text-muted-foreground">{resident.moveInDate}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Expected Exit</p>
                      <p className="text-muted-foreground">{resident.expectedExit}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Case Manager</p>
                      <p className="text-muted-foreground">{resident.caseManager}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm">View Full Profile</Button>
                    <Button size="sm" variant="outline">Update Case Notes</Button>
                    <Button size="sm" variant="outline">Schedule Meeting</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure dashboard preferences and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Facility Information</h3>
                    <div className="grid gap-4">
                      <div>
                        <Label>Current Capacity</Label>
                        <Input defaultValue="12" type="number" className="mt-1" />
                      </div>
                      <div>
                        <Label>Contact Email</Label>
                        <Input defaultValue="info@agapesafetynest.org" type="email" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;