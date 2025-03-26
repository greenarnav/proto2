
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Calendar, Settings, User, Users } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onTimeRangeChange?: (range: string) => void;
  userName?: string;
  userImage?: string;
  notifications?: number;
}

const DashboardHeader = ({
  title,
  subtitle,
  onTimeRangeChange,
  userName = "John Doe",
  userImage,
  notifications = 0
}: DashboardHeaderProps) => {
  return (
    <header className="w-full flex flex-col gap-4 mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
            <Badge variant="outline" className="relative top-px hidden sm:inline-flex px-2.5 py-0.5 text-xs">
              Beta
            </Badge>
          </div>
          {subtitle && (
            <p className="text-muted-foreground max-w-md text-balance">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search locations..."
              className="w-64 pl-8 rounded-full bg-background border-muted"
            />
          </div>
          
          <Button size="icon" variant="ghost" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </Button>
          
          <Button size="icon" variant="ghost">
            <Users className="h-5 w-5" />
          </Button>
          
          <Button size="icon" variant="ghost">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-9 w-9 transition-transform hover:scale-105">
            <AvatarImage src={userImage} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {onTimeRangeChange && (
        <Tabs 
          defaultValue="arnav" 
          className="w-full"
          onValueChange={onTimeRangeChange}
        >
          <TabsList className="grid grid-cols-4 sm:w-[400px]">
            <TabsTrigger value="arnav">Arnav</TabsTrigger>
            <TabsTrigger value="sheetal">Sheetal</TabsTrigger>
            <TabsTrigger value="shahraan">Shahraan</TabsTrigger>
            <TabsTrigger value="lena">Lena</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </header>
  );
};

export default DashboardHeader;
