'use client';

import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Search, 
  Plus, 
  MessageSquare, 
  Pin, 
  Archive, 
  Send,
  MoreVertical,
  User,
  ShieldCheck,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getMessagingThreads, getMessagesForThread } from '@/lib/services/messaging-service';
import { MessagingThread, Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { PageHeader } from '@/components/layout/PageHeader';

export default function MessagingPage() {
  const [threads, setThreads] = useState<MessagingThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessagingThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadThreads() {
      try {
        const data = await getMessagingThreads();
        setThreads(data);
      } catch (error) {
        console.error('Failed to load threads:', error);
      } finally {
        setLoading(false);
      }
    }
    loadThreads();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedThread) return;
      setLoadingMessages(true);
      try {
        const data = await getMessagesForThread(selectedThread.id);
        setMessages(data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    }
    loadMessages();
  }, [selectedThread]);

  const handleSendMessage = () => {
    toast({
      title: "Message Transmission Restricted",
      description: "Secure operational messaging is currently read-only. Access restricted by BANE governance.",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading authenticated communication channels...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader 
        title="Operational Messaging" 
        status="live"
        description="The Strategic Messaging module facilitates high-fidelity, real-time communication between SCINGULAR command and all active field units. It provides a governed environment for exchanging tactical updates, mission-critical documentation, and forensic findings. By integrating Scing™ intelligence layers, the platform can automatically categorize conversations and flag urgent operational alerts. This unified communication surface is the lifeline of our global operations, ensuring that every professional interaction is archived and audit-ready."
      />
      <div className="grid flex-1 grid-cols-[350px_1fr] gap-4 min-h-0 overflow-hidden mt-4 px-4 lg:px-6">
        {/* Threads List Sidebar */}
        <Card className="bg-card/60 backdrop-blur-sm border-r flex flex-col overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Threads
            </h2>
            <Button variant="ghost" size="icon" disabled><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search threads..." className="pl-9 h-9" />
          </div>
        </CardHeader>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {threads.map(thread => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={cn(
                  "flex flex-col gap-1 p-4 text-left transition-colors hover:bg-muted/50 border-b",
                  selectedThread?.id === thread.id && "bg-muted shadow-inner border-l-2 border-l-primary"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-sm truncate max-w-[180px]">{thread.title}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(thread.last_activity_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate line-clamp-1">{thread.last_message_preview}</p>
                <div className="flex items-center gap-2 mt-1">
                  {thread.status === 'pinned' && <Pin className="h-3 w-3 text-primary" />}
                  {thread.status === 'archived' && <Archive className="h-3 w-3 text-muted-foreground" />}
                  {thread.unread_count > 0 && (
                    <Badge variant="pro" className="h-4 px-1 text-[10px] min-w-[16px] flex items-center justify-center">
                      {thread.unread_count}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Thread Content */}
      <Card className="bg-card/40 backdrop-blur-sm flex flex-col overflow-hidden">
        {selectedThread ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{selectedThread.title}</CardTitle>
                  <CardDescription className="text-xs truncate max-w-[400px]">
                    Channel Status: <span className="font-medium text-pro">ENCRYPTED</span> • {selectedThread.participants.join(', ')}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" disabled><Flag className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" disabled><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <Separator />
            <ScrollArea className="flex-1 p-6">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {messages.map(msg => (
                    <div key={msg.id} className={cn(
                      "flex flex-col max-w-[80%] gap-1",
                      msg.sender_id === 'system' ? "self-start" : "self-end items-end"
                    )}>
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{msg.sender_name}</span>
                        <span className="text-[10px] text-muted-foreground/60">{new Date(msg.sent_at).toLocaleTimeString()}</span>
                      </div>
                      <div className={cn(
                        "rounded-xl px-4 py-2 text-sm shadow-sm",
                        msg.sender_id === 'system' 
                          ? "bg-card border border-border rounded-tl-none" 
                          : "bg-primary text-white rounded-tr-none"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div className="text-center italic text-[10px] text-muted-foreground py-4">
                    — End of Operational Activity Log —
                  </div>
                </div>
              )}
            </ScrollArea>
            <Separator />
            <div className="p-4 bg-card/40">
              <div className="flex items-center gap-2 relative">
                <Input 
                  placeholder="Inquiry or operational update..." 
                  className="bg-background/20 pr-12 focus-visible:ring-primary"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled
                />
                <Button 
                  size="icon" 
                  className="absolute right-1 h-8 w-8"
                  onClick={handleSendMessage}
                  disabled
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Messaging is bounded to authenticated operational parties. Outbound transmission restricted in beta.
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center p-12">
            <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h3 className="font-semibold text-lg">Select a Thread</h3>
            <p className="text-muted-foreground text-sm max-w-xs mt-1">
              Choose an operational thread from the list to view historical activity and authenticated logs.
            </p>
          </div>
        )}
      </Card>
      </div>
    </div>
  );
}
