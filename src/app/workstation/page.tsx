'use client';
import { useState } from "react";
import AppShell from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Settings,
  Shield,
  CreditCard,
  Bell,
  HardDrive,
  Cpu,
  Key,
  Smartphone,
  Sparkles,
  Bot,
  Mic,
  Volume2,
  Trash2,
  Plus,
  Lock,
  Eye,
  Activity,
  Zap
} from "lucide-react";
import { useAuthStore } from "@/lib/auth/auth-service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { WorkstationLocationSettings } from "@/components/workstation-location-settings";
import { WorkstationTimeFormatSwitch } from "@/components/workstation-time-format-switch";
import { CANON } from "@/core/canon/terminology";

export default function WorkstationPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your workstation configuration has been updated.",
    });
  };

  return (
    <AppShell userId={user?.uid}>
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workstation Command</h1>
          <p className="text-muted-foreground max-w-2xl mt-1">This is your personal command center for managing your profile, devices, and settings. Configure your professional credentials, manage device keys, customize your {CANON.BFI}, and fine-tune your marketplace presence.</p>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
            <TabsTrigger value="profile" className="py-2"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
            <TabsTrigger value="devices" className="py-2"><Smartphone className="mr-2 h-4 w-4"/>Devices</TabsTrigger>
            <TabsTrigger value="keys" className="py-2"><Key className="mr-2 h-4 w-4"/>LARI Keys</TabsTrigger>
            <TabsTrigger value="ai" className="py-2"><Sparkles className="mr-2 h-4 w-4"/>Voice & {CANON.BFI}</TabsTrigger>
            <TabsTrigger value="security" className="py-2"><Shield className="mr-2 h-4 w-4"/>Security</TabsTrigger>
            <TabsTrigger value="notifications" className="py-2"><Bell className="mr-2 h-4 w-4"/>Alerts</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inspector Profile</CardTitle>
                <CardDescription>
                  Manage your public-facing inspector identity and credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input defaultValue={user?.displayName || "Inspector"} />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input defaultValue={user?.email || ""} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>Organization</Label>
                        <Input placeholder="Company Name" />
                    </div>
                    <div className="space-y-2">
                        <Label>License / Certification ID</Label>
                        <Input placeholder="E.g. NACHI-123456" />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <Label>Bio / Expertise</Label>
                    <Input className="h-24" placeholder="Briefly describe your specialties..." />
                 </div>

                 <WorkstationLocationSettings />
                 <WorkstationTimeFormatSwitch />

              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-4">
             <Card>
                <CardHeader>
                    <CardTitle>Connected Hardware</CardTitle>
                    <CardDescription>
                         Manage, calibrate, and fine-tune your connected hardware and {CANON.BFI} interfaces outside of active inspections.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Device Cards (Mock) */}
                    <Card className="bg-secondary/20 border-dashed">
                        <CardHeader className="pb-2">
                            <Smartphone className="h-8 w-8 mb-2 text-primary" />
                            <CardTitle className="text-base">Mobile Command</CardTitle>
                            <CardDescription>iPhone 15 Pro Max</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="text-xs text-muted-foreground space-y-1">
                                <div className="flex justify-between"><span>Status:</span> <span className="text-green-500">Active</span></div>
                                <div className="flex justify-between"><span>Last Sync:</span> <span>Just now</span></div>
                             </div>
                        </CardContent>
                         <CardFooter>
                             <Button variant="outline" size="sm" className="w-full" asChild>
                                 <Link href="/workstation/devices/mobile-01">Manage</Link>
                             </Button>
                         </CardFooter>
                    </Card>

                    <Card className="bg-secondary/20 border-dashed">
                        <CardHeader className="pb-2">
                            <Eye className="h-8 w-8 mb-2 text-primary" />
                            <CardTitle className="text-base">LARI Vision Node</CardTitle>
                            <CardDescription>{CANON.BFI} Image Analysis</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <div className="text-xs text-muted-foreground space-y-1">
                                <div className="flex justify-between"><span>Status:</span> <span className="text-yellow-500">Standby</span></div>
                                <div className="flex justify-between"><span>Firmware:</span> <span>v2.4.1</span></div>
                             </div>
                        </CardContent>
                        <CardFooter>
                             <Button variant="outline" size="sm" className="w-full" asChild>
                                 <Link href="/workstation/vision">Calibrate</Link>
                             </Button>
                         </CardFooter>
                    </Card>

                    <Card className="bg-secondary/20 border-dashed flex flex-col items-center justify-center text-center p-6 min-h-[200px] hover:bg-secondary/40 transition-colors cursor-pointer">
                         <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-primary" />
                         </div>
                         <h3 className="font-medium">Add New Device</h3>
                         <p className="text-sm text-muted-foreground mt-1">Connect drone, camera, or sensor</p>
                    </Card>
                </CardContent>
             </Card>
          </TabsContent>

          {/* Keys Tab */}
          <TabsContent value="keys" className="space-y-4">
             <Card>
                 <CardHeader>
                     <CardTitle>LARI Keys & Entitlements</CardTitle>
                     <CardDescription>
                         Manage your active software modules and specialized analysis engines.
                     </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="border rounded-lg p-4 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <div className="bg-purple-500/10 p-2 rounded-lg"><Activity className="h-6 w-6 text-purple-500" /></div>
                             <div>
                                 <h4 className="font-bold">LARI-THERM Key</h4>
                                 <p className="text-sm text-muted-foreground">Advanced thermal analysis module</p>
                             </div>
                         </div>
                         <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">Active</Badge>
                     </div>

                     <div className="border rounded-lg p-4 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <div className="bg-blue-500/10 p-2 rounded-lg"><Zap className="h-6 w-6 text-blue-500" /></div>
                             <div>
                                 <h4 className="font-bold">LARI-MAPPER Key</h4>
                                 <p className="text-sm text-muted-foreground">LiDAR point cloud processing</p>
                             </div>
                         </div>
                         <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">Active</Badge>
                     </div>

                     <div className="border rounded-lg p-4 flex items-center justify-between opacity-60">
                         <div className="flex items-center gap-4">
                             <div className="bg-orange-500/10 p-2 rounded-lg"><Cpu className="h-6 w-6 text-orange-500" /></div>
                             <div>
                                 <h4 className="font-bold">LARI-PRECOG Key</h4>
                                 <p className="text-sm text-muted-foreground">Predictive failure modeling</p>
                             </div>
                         </div>
                         <Button variant="outline" size="sm">Purchase</Button>
                     </div>
                 </CardContent>
             </Card>
          </TabsContent>

          {/* Voice & AI Tab */}
          <TabsContent value="ai" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Voice & {CANON.BFI} Settings</CardTitle>
                    <CardDescription>
                        Customize your interaction with Scingular's {CANON.BFI} features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Wake Word Detection</Label>
                                <p className="text-sm text-muted-foreground">Listen for "Hey Scing" to activate voice command.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Voice Feedback</Label>
                                <p className="text-sm text-muted-foreground">Allow Scing to respond verbally.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                             <div className="space-y-0.5">
                                <Label className="text-base">Autonomous Suggestions</Label>
                                <p className="text-sm text-muted-foreground">Proactively suggest findings during inspection.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                        <Label>Voice Profile</Label>
                        <Select defaultValue="scing_neutral">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a voice" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="scing_neutral">Scing Neutral (Default)</SelectItem>
                                <SelectItem value="scing_assertive">Scing Assertive</SelectItem>
                                <SelectItem value="scing_soft">Scing Soft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                     <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-lg font-medium">{CANON.BFI} Learning Preferences</h4>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="learn-local" defaultChecked />
                                <Label htmlFor="learn-local" className="font-normal">Learn from my correction history locally.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="learn-global" />
                                <Label htmlFor="learn-global" className="font-normal">Contribute anonymous data to global fleet learning.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="learn-data" defaultChecked />
                                <Label htmlFor="learn-data" className="font-normal">Use my inspection data to personalize {CANON.BFI} summaries and suggestions.</Label>
                            </div>
                     </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave}>Save {CANON.BFI} Preferences</Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>History & Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <h5 className="font-medium">Voice Command Logs</h5>
                                <p className="text-sm text-muted-foreground">Review or clear your past voice interactions.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">View Logs</Button>
                                <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4"/></Button>
                            </div>
                        </div>
                         <div className="flex items-center justify-between">
                            <div>
                                <h5 className="font-medium">{CANON.BFI} Search History</h5>
                                <p className="text-sm text-muted-foreground">Review or clear your past {CANON.BFI} search queries.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">View History</Button>
                                <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4"/></Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
             </Card>
          </TabsContent>
          
           {/* Security Tab (Mock) */}
           <TabsContent value="security" className="space-y-4">
               <Card>
                   <CardHeader>
                       <CardTitle>Security & Access</CardTitle>
                       <CardDescription>Manage password, 2FA, and sessions.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                        <Button variant="outline">Change Password</Button>
                        <Button variant="outline">Enable 2-Factor Authentication</Button>
                        <Button variant="destructive">Log Out All Other Sessions</Button>
                   </CardContent>
               </Card>
           </TabsContent>
           
           {/* Notifications Tab (Mock) */}
           <TabsContent value="notifications" className="space-y-4">
               <Card>
                   <CardHeader>
                       <CardTitle>Notification Preferences</CardTitle>
                   </CardHeader>
                   <CardContent>
                       <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Email Notifications</Label>
                                <Switch defaultChecked />
                            </div>
                             <div className="flex items-center justify-between">
                                <Label>Push Notifications</Label>
                                <Switch defaultChecked />
                            </div>
                             <div className="flex items-center justify-between">
                                <Label>SMS Alerts</Label>
                                <Switch />
                            </div>
                       </div>
                   </CardContent>
               </Card>
           </TabsContent>

        </Tabs>
      </div>
    </AppShell>
  );
}
