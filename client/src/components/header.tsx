import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Plane } from "lucide-react";
import { LocalStorageService } from "@/lib/local-storage";

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ currentTab, onTabChange }: HeaderProps) {
  const user = LocalStorageService.getUser();
  const userInitials = user?.name
    ?.split(" ")
    ?.map((n: string) => n[0])
    ?.join("") || "JD";

  const tabs = [
    { id: "search", label: "Search" },
    { id: "trips", label: "My Trips" },
    { id: "deals", label: "Deals" },
    { id: "preferences", label: "Preferences" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600 flex items-center">
                <Plane className="mr-2 h-6 w-6" />
                TravelMate
              </h1>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-1 pb-4 text-sm font-medium border-b-2 transition-colors ${
                    currentTab === tab.id
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name || "John Doe"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
