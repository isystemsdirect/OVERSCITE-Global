'use client';

import {
  MoreVertical,
  PlusCircle,
  File,
  Search,
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  ListFilter,
  User,
  Users,
  Bot,
  ExternalLink,
  Image as ImageIcon,
  Video,
  Paperclip,
  Rss,
  Hash,
  AlertCircle,
  Clock,
  Info
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { mockInspectors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScingularLogoText } from '@/components/ui/logo-text';
import { AnnouncementsWidget } from '@/components/announcements-widget';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const mockPosts = [
  {
    id: 1,
    authorId: 'USR-002',
    type: 'question',
    title: 'Unusual Efflorescence Pattern on a Poured Concrete Wall?',
    content: 'Came across a strange, almost crystalline efflorescence pattern on a 1980s foundation wall. It doesn\'t look like typical powdery deposits. Has anyone seen this before? Attached a photo. Wondering if it could be related to a specific additive in the concrete mix from that era.',
    tags: ['concrete', 'foundation', 'efflorescence'],
    likes: 12,
    comments: 4,
    bookmarked: false,
    isAiResponse: false,
  },
  {
    id: 2,
    authorId: 'AI',
    type: 'ai-response',
    title: 'Re: Unusual Efflorescence Pattern',
    content: 'Based on the visual data, the crystalline structure may indicate the presence of sulfates in the groundwater reacting with the portland cement. This is sometimes referred to as "sulfate attack," which can be more aggressive than typical efflorescence. Recommend testing the soil and water PH levels. Cross-referencing with ACI 201.2R-08 (Guide to Durable Concrete) suggests this pattern aligns with external sulfate attack.',
    tags: [],
    likes: 8,
    comments: 0,
    bookmarked: true,
    isAiResponse: true,
  },
];

const mockNews = [
    {
        id: 1,
        title: "T2D2, an AI-powered building inspection platform, launches enhanced version",
        source: "BuiltWorlds",
        time: "2h ago",
        url: "#",
        imageUrl: "https://picsum.photos/seed/news1/150/150",
        imageHint: "technology abstract"
    },
    {
        id: 2,
        title: "New Drone Regulations Impacting Roof Inspections in 2024",
        source: "The Inspector",
        time: "8h ago",
        url: "#",
        imageUrl: "https://picsum.photos/seed/news2/150/150",
        imageHint: "drone sky"
    },
    {
        id: 3,
        title: "AI in Construction: Thornton Tomasetti’s T2D2 gets an upgrade",
        source: "AEC Magazine",
        time: "1d ago",
        url: "#",
        imageUrl: "https://picsum.photos/seed/news3/150/150",
        imageHint: "construction site"
    },
]

import { PageHeader } from '@/components/layout/PageHeader';

export default function CommunityPage() {
  const user = mockInspectors[0];
  const avatar = PlaceHolderImages.find(p => p.id === user.imageHint);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Community Hub" 
        status="experimental"
        description="The OVERSCITE Community module is a governed social environment designed for professional collaboration, mentorship, and collective intelligence gathering. It connects verified field units across various jurisdictions, allowing them to share mission-critical findings and technical consensus markers in real-time. Scing™ facilitates these interactions by providing contextual data and archival support for all professional discussions. This collaborative layer ensures that the expertise of the individual inspector is amplified by the strength of the entire global network."
      >
        <Button variant="outline" size="sm" asChild className="h-8">
            <Link href="/social"><Rss className="mr-2 h-4 w-4" /> Social Timeline</Link>
        </Button>
      </PageHeader>

        {/* Truthfulness Banner */}
        <Alert className="bg-pro/5 border-pro/20 rounded-xl">
            <Info className="h-4 w-4 text-pro" />
            <AlertTitle className="text-pro font-bold text-xs uppercase tracking-widest">Community Core Under Extension</AlertTitle>
            <AlertDescription className="text-[11px] text-muted-foreground">
                Interactive social mutations (posting, liking, commenting) are currently locked during the Tier 4 Operational Rollout. 
                This surface remains **Read-Only** for information distribution and archival research.
            </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 items-start">
            <div className="space-y-6">
                 <Card className="bg-card/40 backdrop-blur-sm border-border/50 opacity-60 rounded-xl">
                    <CardHeader className="flex-row items-center gap-4">
                        {avatar && <Image src={avatar.imageUrl} alt={user.name} width={40} height={40} className="rounded-full grayscale" data-ai-hint={user.imageHint} />}
                        <div className="flex-1">
                            <Input placeholder="Posting disabled during extension..." disabled className="bg-muted/50 border-none cursor-not-allowed rounded-xl" />
                        </div>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center pb-4 px-4">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" disabled><ImageIcon className="h-4 w-4 mr-2" /> Image</Button>
                            <Button variant="ghost" size="sm" disabled><Video className="h-4 w-4 mr-2" /> Video</Button>
                        </div>
                        <Button variant="secondary" size="sm" disabled>Locked</Button>
                    </CardFooter>
                </Card>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search knowledge archive..." className="pl-9 rounded-xl bg-card/40 border-border/50 h-10" />
                    </div>
                </div>

                {mockPosts.map((post) => {
                    const author = post.isAiResponse ? { name: 'Scingular AI', avatarUrl: '/logo.svg', imageHint: '' } : mockInspectors.find(i => i.id === post.authorId);
                    const postAvatar = post.isAiResponse ? { imageUrl: '/logo.svg' } : PlaceHolderImages.find(p => p.id === author?.imageHint);
                    
                    return (
                    <Card key={post.id} className="bg-card/40 backdrop-blur-sm border-border/50 group hover:bg-card/60 transition-colors">
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                {postAvatar && (
                                    <Image src={postAvatar.imageUrl} alt={author?.name || 'AI'} width={40} height={40} className="rounded-full opacity-80" data-ai-hint={author?.imageHint} />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        {post.isAiResponse ? <Bot className="h-5 w-5 text-pro" /> : <User className="h-5 w-5 text-muted-foreground" />}
                                        <CardTitle className="text-lg">{post.title}</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">
                                        Authenticated by {post.isAiResponse ? <ScingularLogoText className="text-sm" /> : author?.name}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {post.content}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {post.tags.map(tag => <Badge key={tag} variant="outline" className="text-[10px] bg-muted/30">#{tag}</Badge>)}
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono border-t border-border/50 pt-3 opacity-70">
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" /> {post.likes} ENDORSEMENTS
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" /> {post.comments} RESPONSES
                            </div>
                             <div className="flex items-center gap-1 ml-auto">
                                <Bookmark className="h-3 w-3" /> ARCHIVED
                            </div>
                        </CardFooter>
                    </Card>
                    )
                })}
            </div>

             <div className="sticky top-24 space-y-6">
                <AnnouncementsWidget />
                
                 <Card className="bg-card/40 backdrop-blur-sm border-border/50">
                    <CardContent className="p-4 flex items-center gap-4">
                        {avatar && <Image src={avatar.imageUrl} alt={user.name} width={48} height={48} className="rounded-full border border-primary/20" data-ai-hint={user.imageHint} />}
                        <div>
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{user.certifications[0].name.substring(0, 25)}...</p>
                            <Link href="/profile" className="text-[11px] text-pro hover:underline">View Public Identity</Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-sm border-border/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2 opacity-70">
                            <Rss className="h-4 w-4" /> Global Intelligence
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {mockNews.map(item => (
                                <li key={item.id} className="group cursor-not-allowed">
                                    <div className="flex items-start gap-4">
                                        <Image src={item.imageUrl} alt={item.title} width={48} height={48} className="rounded object-cover opacity-60 grayscale" data-ai-hint={item.imageHint} />
                                        <div className="flex-1">
                                            <p className="text-xs font-medium leading-tight text-muted-foreground line-clamp-2">{item.title}</p>
                                            <div className="flex items-center justify-between text-[10px] opacity-50 mt-1">
                                                <span>{item.source}</span>
                                                <span>{item.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                 <Card className="bg-card/40 backdrop-blur-sm border-border/50 opacity-70">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Users className="h-4 w-4" /> Contributors
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockInspectors.slice(1,4).map(inspector => {
                            const contributorAvatar = PlaceHolderImages.find(p => p.id === inspector.imageHint);
                            return (
                                <div key={inspector.id} className="flex items-center gap-3">
                                    {contributorAvatar && <Image src={contributorAvatar.imageUrl} alt={inspector.name} width={28} height={28} className="rounded-full grayscale" />}
                                    <div>
                                        <p className="font-medium text-xs text-muted-foreground">{inspector.name}</p>
                                        <p className="text-[10px] text-muted-foreground/60">{inspector.certifications[0].name.substring(0, 25)}...</p>
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
