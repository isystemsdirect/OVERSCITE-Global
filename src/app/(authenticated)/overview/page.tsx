
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  Bot,
  Brain,
  BrainCircuit,
  Building2,
  Calendar,
  Cloud,
  CloudRain,
  Cpu,
  Database,
  Eye,
  FileText,
  Gem,
  Globe,
  HardDrive,
  HeartPulse,
  Layers,
  LayoutDashboard,
  Lock,
  Map,
  MessageSquare,
  Mic,
  Network,
  Radio,
  Rocket,
  Scale,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Speaker,
  Sun,
  Thermometer,
  Timer,
  TrendingUp,
  User,
  Users,
  Video,
  Wind,
  Wrench,
  Zap
} from 'lucide-react';
import OversciteLogo from '../../../../public/logo.svg';
import ScingIcon from '../../../../public/Scing_ButtonIcon_White.svg';

const lariSuite = [
    { 
        name: "LARI-VISION", 
        icon: Eye,
        description: "Processes visual data for defect recognition, OCR, and 3D modeling. Uses Genkit flows with Gemini 1.5 Flash for multimodal analysis." 
    },
    { 
        name: "LARI-MAPPER", 
        icon: Map,
        description: "Processes LiDAR and 3D data for floorplans and geometric analysis. Generates spatial understanding from point clouds." 
    },
    { 
        name: "LARI-PRISM", 
        icon: Gem,
        description: "Simulates API lookups to authoritative databases for material composition analysis (Periodic Table integration)." 
    },
    { 
        name: "LARI-THERM & LARI-ECHO", 
        icon: Thermometer,
        description: "Interpret thermal, infrared, sonar, and acoustic data for subsurface defect detection and roof surface temperature modeling." 
    },
    { 
        name: "LARI-COMPLIANCE", 
        icon: ShieldCheck,
        description: "Cross-references findings against codes and standards (IBC, NEC, etc.) to ensure regulatory adherence." 
    },
    { 
        name: "LARI-SYNTHESIZER", 
        icon: FileText,
        description: "Synthesizes fragmented data points into cohesive, narrative-driven executive summaries and reports." 
    },
    { 
        name: "LARI-GUANGEL", 
        icon: HeartPulse,
        description: "The 'Guardian Angel' engine. Monitors field safety via Kinetic Awareness (fall detection), Biometric Overlay (heart rate/stress), and Environmental Risk." 
    },
    { 
        name: "LARI-PRECOG", 
        icon: Brain,
        description: "Predictive engine analyzing telemetry to forecast component failures and operational risks before they occur." 
    },
    {
        name: "LARI-NARRATOR",
        icon: Speaker,
        description: "Converts text summaries into audio presentations using Google Cloud Text-to-Speech for audible briefings."
    }
];

const modules = [
    {
        title: "Dashboard Command Center",
        icon: LayoutDashboard,
        path: "/dashboard",
        features: [
            "Real-time revenue & inspection charts",
            "Live Operations Map for team tracking",
            "LARI-GUANGEL safety widget",
            "Daily agenda & activity feed"
        ]
    },
    {
        title: "Weather Command Center",
        icon: CloudRain,
        path: "/maps-weather",
        features: [
            "Real-time atmospheric intelligence",
            "Inspection Risk Index (IRI) scoring",
            "Live radar & storm vector tracking",
            "Roof Surface Temperature modeling"
        ]
    },
    {
        title: "Inspection Lifecycle",
        icon: Search,
        path: "/inspections",
        features: [
            "New Capture Wizard with multi-modal input",
            "Augmented Intelligence finding ID",
            "Automated report generation (PDF, PPTX)",
            "Digital signatures & chain of custody"
        ]
    },
    {
        title: "Teams & Dispatch",
        icon: Users,
        path: "/teams",
        features: [
            "Geospatial dispatch via Google Maps",
            "Real-time inspector availability status",
            "Job board & assignment wizard",
            "Integrated messaging system"
        ]
    },
    {
        title: "Marketplace & Community",
        icon: Globe,
        path: "/marketplace",
        features: [
            "Find & hire certified inspectors",
            "Purchase LARI Keys & entitlements",
            "Community knowledge hub",
            "Social feed with Scing participation"
        ]
    },
    {
        title: "Workstation & Device Lab",
        icon: Wrench,
        path: "/workstation",
        features: [
            "Drone Builder & Device management",
            "Profile & Certification handling",
            "Periodic Table element selector",
            "Voice & BFI personalization"
        ]
    },
    {
        title: "BFI Trinity Overview",
        icon: Cpu,
        path: "/overview",
        features: [
            "LARI™ Analysis Suite",
            "Scing™ Human-Layer Interface",
            "BANE™ Trust Engine",
            "System Architecture Report"
        ]
    }
];

const weatherStackFeatures = [
    {
        title: "Inspection Risk Index (IRI)",
        icon: Scale,
        description: "A calculated score (0-100) weighing wind gust, precipitation, lightning distance, and heat index to determine field operation safety."
    },
    {
        title: "LARI-GUANGEL™ Safety Monitor",
        icon: Activity,
        description: "Fuses environmental data with kinetic sensors (accelerometer/gyro) and biometrics to detect falls, fatigue, and heat stress."
    },
    {
        title: "Roof Surface Temp Model",
        icon: Sun,
        description: "Algorithms estimating contact burn risk by analyzing ambient temp, solar radiation, wind speed, and roof material properties."
    },
    {
        title: "Liability Logging Service",
        icon: Database,
        description: "Cryptographically logs weather snapshots and safety scores at the start/end of every inspection for legal defensibility."
    }
];

const integrations = [
    { name: "Google Firebase", desc: "Auth, Firestore, Storage, Functions" },
    { name: "Google Gemini (Genkit)", desc: "Multimodal Augmented Intelligence" },
    { name: "Google Maps Platform", desc: "Geospatial Visualization" },
    { name: "Picovoice Porcupine", desc: "Wake Word Detection" },
    { name: "Stream Chat", desc: "Real-time Messaging" },
    { name: "AWS S3", desc: "Scalable Media Ingestion" },
    { name: "OpenWeatherMap", desc: "Environmental Data Fusion" },
    { name: "NOAA/NWS Feeds", desc: "Alerts & Radar Tiles" }
];

export default function OverviewPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6 py-8">
            <div className="space-y-12 text-foreground">
                
                {/* Header Section */}
                <PageHeader 
                  title="System Architecture & Feature Report" 
                  status="candidate"
                  description="The Overview Report module provides a high-level forensic synthesis of all jurisdictional activities and inspection outcomes within the OVERSCITE ecosystem. It utilizes advanced data aggregation to present a comprehensive view of system health, regulatory compliance, and mission-critical performance metrics. Analysts can leverage this report to identify structural trends, evaluate personnel efficiency, and generate evidentiary documentation for governance reviews. As a core transparency tool, the Overview Report ensures that all organizational actions are traceable and align with the sovereign SCINGULAR mandate."
                />

                <Separator className="my-8" />

                {/* Core Architecture - The Trinity */}
                <section className="space-y-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
                            <Cpu className="h-8 w-8 text-primary" /> 
                            The BFI Trinity
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
                            The platform’s Bona-Fide Intelligence (BFI) is expressed through three governed pillars —
                            analysis, human-layer interaction, and trust enforcement — each constrained to advisory support
                            under inspector authority.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="bg-gradient-to-br from-card to-background border-primary/20 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BrainCircuit className="h-24 w-24" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                                    <Network className="h-6 w-6" /> LARI™
                                </CardTitle>
                                <CardDescription className="text-base font-medium">Logistical, Analytical, & Reporting Interface</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">
                                    The <strong>Analytical Brain</strong>. A federated suite of specialized sub-engines (Vision, Therm, Compliance) that ingest raw sensor data and transform it into structured, actionable Augmented Intelligence using Genkit and Gemini 1.5 Flash.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-card to-background border-primary/20 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Bot className="h-24 w-24" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                                    <div className="h-6 w-6">
                                       <ScingIcon className="w-full h-full fill-current" />
                                    </div>
                                    Scing™
                                </CardTitle>
                                <CardDescription className="text-base font-medium">Human-Layer Interface & Command Presence</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">
                                    Scing is the human-facing interface that translates inspector intent into
                                    governed system actions and workflows. Scing does not declare compliance,
                                    does not auto-generate final reports, and never overrides the inspector.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-card to-background border-primary/20 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Lock className="h-24 w-24" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                                    <ShieldCheck className="h-6 w-6" /> BANE™
                                </CardTitle>
                                <CardDescription className="text-base font-medium">Business Analytics & Network Engine</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">
                                    The <strong>Guardian & Strategist</strong>. Ensures cryptographic provenance of all data (Chain of Custody), enforces policy gating, and aggregates anonymized data for high-level business intelligence (DaaS).
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Weather & Environmental Stack (New Feature Highlight) */}
                <section className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b pb-4">
                        <div>
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <CloudRain className="h-8 w-8 text-primary" /> 
                                OVERSCITE™ Weather & LARI-GUANGEL™ Stack
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                Operational Environmental Intelligence Layer: Transforming atmospheric data into safety & risk metrics.
                            </p>
                        </div>
                        <div className="text-sm font-mono bg-muted px-3 py-1 rounded">
                            Version 1.0.0 (FBS_UTCB)
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {weatherStackFeatures.map((feat) => {
                            const Icon = feat.icon;
                            return (
                                <Card key={feat.title} className="bg-card hover:bg-card/80 transition-colors">
                                    <CardHeader className="pb-2">
                                        <Icon className="h-8 w-8 text-primary mb-2" />
                                        <CardTitle className="text-lg leading-tight">{feat.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{feat.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </section>

                {/* LARI Deep Dive */}
                <section className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b pb-4">
                        <div>
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <Brain className="h-8 w-8 text-primary" /> 
                                LARI™ Federated Engine Suite
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                A breakdown of the specialized Augmented Intelligence models powering the analysis pipeline.
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {lariSuite.map((engine) => {
                            const Icon = engine.icon;
                            return (
                                <Card key={engine.name} className="bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300">
                                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="font-semibold text-lg">{engine.name}</div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{engine.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </section>

                {/* Modules Overview */}
                <section className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b pb-4">
                        <div>
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <Layers className="h-8 w-8 text-primary" /> 
                                Operational Modules
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                User-facing applications and workflows within the ecosystem.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {modules.map((mod) => {
                            const Icon = mod.icon;
                            return (
                                <Card key={mod.title} className="flex flex-col overflow-hidden">
                                    <div className="p-6 flex flex-row items-start gap-4">
                                        <div className="bg-secondary p-3 rounded-xl h-fit">
                                            <Icon className="h-8 w-8 text-foreground" />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <h3 className="text-xl font-bold">{mod.title}</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                                {mod.features.map((feat, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                        {feat}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 px-6 py-2 text-xs font-mono text-muted-foreground border-t flex items-center gap-2">
                                        <Globe className="h-3 w-3" /> Route: {mod.path}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </section>

                {/* Technical Stack & Infrastructure */}
                <section className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Server className="h-6 w-6 text-primary" /> Infrastructure & Integrations
                            </CardTitle>
                            <CardDescription>Best-in-class external services powering the backend.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {integrations.map((tech) => (
                                    <div key={tech.name} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                        <Cloud className="h-4 w-4 text-primary" />
                                        <div>
                                            <div className="font-semibold text-sm">{tech.name}</div>
                                            <div className="text-xs text-muted-foreground">{tech.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <TrendingUp className="h-6 w-6 text-primary" /> Business & Monetization
                            </CardTitle>
                            <CardDescription>Sustainable growth models driven by BANE™.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Zap className="h-4 w-4" /> SaaS Tiers
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Freemium entry points funneling to Pro ($149/mo) and Enterprise ($399+/mo) subscriptions.
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Gem className="h-4 w-4" /> Entitlements Market
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    A-la-carte purchasing of specialized LARI Keys (e.g., Thermal Analysis Key) via the Marketplace.
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Database className="h-4 w-4" /> Data as a Service (DaaS)
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Selling aggregated, anonymized risk and defect data to insurance, REITs, and OEMs.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
                
                {/* Future Vision */}
                <section className="bg-primary/5 rounded-xl p-8 text-center space-y-4">
                    <Rocket className="h-12 w-12 text-primary mx-auto" />
                    <h2 className="text-2xl font-bold">Defining the Future of Field Intelligence</h2>
                    <p className="max-w-3xl mx-auto text-muted-foreground">
                        OVERSCITE is not merely software; it is the central nervous system for physical asset management. 
                        By creating a self-reinforcing ecosystem where advanced Augmented Intelligence tools drive the creation of valuable data, 
                        we are positioned for exponential growth and complete market domination.
                    </p>
                </section>
            </div>
        </div>
    );
}
