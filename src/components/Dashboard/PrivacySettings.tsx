
import React from 'react';
import DataCard from '@/components/UI/DataCard';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Shield, Info, Download, Trash2, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from '@/lib/utils';

interface PrivacySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'data' | 'analytics' | 'sharing';
}

interface PrivacySettingsProps {
  settings?: PrivacySetting[];
  isLoading?: boolean;
  className?: string;
}

const PrivacySettings = ({ 
  settings = [], 
  isLoading = false, 
  className 
}: PrivacySettingsProps) => {
  const [localSettings, setLocalSettings] = React.useState<PrivacySetting[]>(settings);
  
  React.useEffect(() => {
    if (settings.length > 0) {
      setLocalSettings(settings);
    }
  }, [settings]);
  
  const handleToggle = (id: string) => {
    setLocalSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      )
    );
  };
  
  const getCategoryLabel = (category: PrivacySetting['category']) => {
    switch (category) {
      case 'data': return 'Data Collection';
      case 'analytics': return 'Analytics & Processing';
      case 'sharing': return 'Data Sharing';
      default: return category;
    }
  };
  
  const categories = [...new Set(localSettings.map(setting => setting.category))];
  
  return (
    <DataCard 
      title="Privacy & Security" 
      description="Control how your data is collected and used"
      className={cn("", className)}
      isLoading={isLoading}
      animation="fade"
      delay={500}
    >
      <div className="space-y-6">
        <div className="bg-card/50 border rounded-md p-3 flex gap-3 items-start">
          <div className="mt-0.5">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Your data stays on your device</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Life Dashboard respects your privacy. All data processing happens locally on your device, 
              and nothing is shared without your explicit consent.
            </p>
          </div>
        </div>
        
        {localSettings.length > 0 ? (
          <div className="space-y-5">
            {categories.map(category => (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    {getCategoryLabel(category)}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {localSettings.filter(s => s.category === category && s.enabled).length} of {
                      localSettings.filter(s => s.category === category).length
                    } enabled
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {localSettings.filter(s => s.category === category).map(setting => (
                    <div 
                      key={setting.id} 
                      className="flex items-start justify-between gap-4 p-2 rounded-md hover:bg-muted/30 transition-colors"
                    >
                      <div className="space-y-1 flex-grow">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">
                            {setting.name}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs text-xs">{setting.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-xs text-muted-foreground pr-4">
                          {setting.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center pt-1">
                        <Switch
                          checked={setting.enabled}
                          onCheckedChange={() => handleToggle(setting.id)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
            <h4 className="text-sm font-medium mb-1">No privacy settings configured</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Connect your data sources to manage privacy settings
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export my data
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View data usage
            </Button>
            
            <Button variant="destructive" size="sm" className="text-xs">
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete all data
            </Button>
          </div>
        </div>
      </div>
    </DataCard>
  );
};

export default PrivacySettings;
