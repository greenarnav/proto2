
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataCard from '@/components/UI/DataCard';
import { Twitter, Facebook, Instagram, Linkedin, Mail, User, Heart, MessageCircle, Repeat, ExternalLink } from "lucide-react";
import { cn } from '@/lib/utils';

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'email';
  author: {
    name: string;
    handle?: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  metrics?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  sentiment?: {
    score: number; // -1 to 1
    label: 'positive' | 'neutral' | 'negative';
  };
  link?: string;
}

interface SocialFeedProps {
  posts: SocialPost[];
  isLoading?: boolean;
  className?: string;
}

const SocialFeed = ({ posts = [], isLoading = false, className }: SocialFeedProps) => {
  const [activePlatform, setActivePlatform] = React.useState<string>('all');
  
  const filteredPosts = activePlatform === 'all' 
    ? posts 
    : posts.filter(post => post.platform === activePlatform);
  
  const platforms = [
    { id: 'all', label: 'All', icon: null },
    { id: 'twitter', label: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
    { id: 'facebook', label: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
    { id: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
  ];
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'instagram': return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'linkedin': return <Linkedin className="h-4 w-4 text-blue-700" />;
      case 'email': return <Mail className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };
  
  const getSentimentColor = (sentiment?: SocialPost['sentiment']) => {
    if (!sentiment) return 'bg-gray-200 dark:bg-gray-700';
    
    if (sentiment.label === 'positive') return 'bg-sentiment-positive';
    if (sentiment.label === 'negative') return 'bg-sentiment-negative';
    return 'bg-sentiment-neutral';
  };
  
  return (
    <DataCard 
      title="Social Activity" 
      description="Recent posts and interactions"
      className={cn("", className)}
      isLoading={isLoading}
      animation="fade"
    >
      <Tabs defaultValue="all" onValueChange={setActivePlatform}>
        <TabsList className="w-full justify-start mb-4 overflow-x-auto">
          {platforms.map(platform => (
            <TabsTrigger key={platform.id} value={platform.id} className="flex items-center gap-1.5">
              {platform.icon}
              <span>{platform.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activePlatform} className="mt-0">
          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse p-4 rounded-md border bg-card/50 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/3 bg-muted rounded"></div>
                      <div className="h-3 w-1/4 bg-muted rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 w-2/3 bg-muted rounded"></div>
                  </div>
                </div>
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div key={post.id} className="p-4 rounded-md border bg-card/50 hover:bg-card/80 transition-colors duration-200">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{post.author.name}</span>
                        {post.author.handle && (
                          <span className="text-muted-foreground text-xs">@{post.author.handle}</span>
                        )}
                        <div className="ml-auto flex items-center gap-2">
                          {getPlatformIcon(post.platform)}
                          <time className="text-xs text-muted-foreground">{post.timestamp}</time>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{post.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {post.metrics?.likes !== undefined && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Heart className="h-3.5 w-3.5" />
                              <span>{post.metrics.likes}</span>
                            </div>
                          )}
                          
                          {post.metrics?.comments !== undefined && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>{post.metrics.comments}</span>
                            </div>
                          )}
                          
                          {post.metrics?.shares !== undefined && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Repeat className="h-3.5 w-3.5" />
                              <span>{post.metrics.shares}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {post.sentiment && (
                            <Badge variant="outline" className="text-xs px-2 py-0 h-5 gap-1.5">
                              <span 
                                className={`h-2 w-2 rounded-full ${getSentimentColor(post.sentiment)}`}
                              ></span>
                              <span className="capitalize">{post.sentiment.label}</span>
                            </Badge>
                          )}
                          
                          {post.link && (
                            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                              <a href={post.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No posts available for the selected platform</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Connect accounts
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DataCard>
  );
};

export default SocialFeed;
