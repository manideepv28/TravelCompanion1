import { useState } from "react";
import Header from "@/components/header";
import SearchSection from "@/components/search-section";
import RecommendationsSection from "@/components/recommendations-section";
import DealsSection from "@/components/deals-section";
import TripsSection from "@/components/trips-section";
import PreferencesSection from "@/components/preferences-section";

export default function Home() {
  const [currentTab, setCurrentTab] = useState("search");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === "search" && (
          <>
            <SearchSection />
            <RecommendationsSection />
            <DealsSection />
          </>
        )}
        
        {currentTab === "trips" && <TripsSection />}
        
        {currentTab === "deals" && <DealsSection />}
        
        {currentTab === "preferences" && <PreferencesSection />}
      </main>
    </div>
  );
}
