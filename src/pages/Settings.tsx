import { useState } from "react";
import { Settings as SettingsIcon, User, Bell, Palette, Shield, CreditCard, LogOut, ChevronRight, Moon, Sun } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { LeftRail } from "@/components/LeftRail";
import { NewWorkspaceModal } from "@/components/NewWorkspaceModal";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const sections: SettingSection[] = [
  { id: "profile", title: "Profile", description: "Manage your account details", icon: User },
  { id: "notifications", title: "Notifications", description: "Configure alerts and updates", icon: Bell },
  { id: "appearance", title: "Appearance", description: "Customize theme and display", icon: Palette },
  { id: "privacy", title: "Privacy & Security", description: "Manage data and permissions", icon: Shield },
  { id: "billing", title: "Billing", description: "View plans and payment history", icon: CreditCard },
];

export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("settings");
  const [activeSection, setActiveSection] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === "home") navigate("/");
    else if (id === "recent") navigate("/recent");
    else if (id === "templates") navigate("/templates");
    else if (id === "library") navigate("/library");
  };

  const handleCreateWorkspace = (type: string) => {
    setIsModalOpen(false);
    toast({
      title: "Workspace created",
      description: `Your new ${type} workspace is ready.`,
    });
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onNewWorkspace={() => setIsModalOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftRail activeItem={activeNav} onItemClick={handleNavClick} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-up flex items-center gap-3">
              <SettingsIcon className="h-6 w-6 text-muted-foreground" />
              <div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  Settings
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your account and preferences.
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <nav className="lg:w-56 space-y-1 animate-fade-up" style={{ animationDelay: "50ms" }}>
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-150",
                        activeSection === section.id
                          ? "bg-accent/10 text-foreground"
                          : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
                <div className="pt-4 border-t border-border mt-4">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors duration-150">
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </nav>

              {/* Content */}
              <div className="flex-1 animate-fade-up" style={{ animationDelay: "100ms" }}>
                {activeSection === "profile" && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl border border-border bg-card">
                      <h2 className="text-lg font-medium text-foreground mb-4">Profile Information</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground block mb-2">Name</label>
                          <input
                            type="text"
                            defaultValue="Alex Chen"
                            className="w-full h-10 px-4 bg-secondary rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground block mb-2">Email</label>
                          <input
                            type="email"
                            defaultValue="alex@example.com"
                            className="w-full h-10 px-4 bg-secondary rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                )}

                {activeSection === "notifications" && (
                  <div className="p-6 rounded-xl border border-border bg-card space-y-6">
                    <h2 className="text-lg font-medium text-foreground">Notifications</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Email Notifications</p>
                          <p className="text-xs text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Push Notifications</p>
                          <p className="text-xs text-muted-foreground">Receive push notifications</p>
                        </div>
                        <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "appearance" && (
                  <div className="p-6 rounded-xl border border-border bg-card space-y-6">
                    <h2 className="text-lg font-medium text-foreground">Appearance</h2>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {darkMode ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
                        <div>
                          <p className="text-sm font-medium text-foreground">Dark Mode</p>
                          <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                        </div>
                      </div>
                      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>
                  </div>
                )}

                {activeSection === "privacy" && (
                  <div className="p-6 rounded-xl border border-border bg-card space-y-6">
                    <h2 className="text-lg font-medium text-foreground">Privacy & Security</h2>
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-surface-hover transition-colors duration-150">
                        <span className="text-sm font-medium text-foreground">Change Password</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-surface-hover transition-colors duration-150">
                        <span className="text-sm font-medium text-foreground">Two-Factor Authentication</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-surface-hover transition-colors duration-150">
                        <span className="text-sm font-medium text-foreground">Export Data</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === "billing" && (
                  <div className="p-6 rounded-xl border border-border bg-card space-y-6">
                    <h2 className="text-lg font-medium text-foreground">Billing</h2>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm font-medium text-foreground">Free Plan</p>
                      <p className="text-xs text-muted-foreground mt-1">You're currently on the free tier.</p>
                    </div>
                    <Button variant="outline">Upgrade Plan</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateWorkspace}
      />
    </div>
  );
}
