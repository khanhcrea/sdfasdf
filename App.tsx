import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_CAT_PROFILE, 
  DEFAULT_WEIGHT_HISTORY, 
  DEFAULT_PHOTO_GALLERY, 
  DEFAULT_DAILY_TASKS, 
  DEFAULT_MOOD_HISTORY 
} from './data/defaultData';
import { CatProfile, WeightRecord, GalleryImage, DailyLogState, MoodRecord } from './types';
import Dashboard from './components/Dashboard';
import AppearanceSection from './components/AppearanceSection';
import WeightSection from './components/WeightSection';
import BehaviorSection from './components/BehaviorSection';
import { 
  Sparkles, Palette, Weight as WeightIcon, Smile, Heart, Menu, X, Gift, Info 
} from 'lucide-react';

export default function App() {
  // Navigation active tab
  type TabType = 'home' | 'appearance' | 'weight' | 'behavior';
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persistence States
  const [profile, setProfile] = useState<CatProfile>(DEFAULT_CAT_PROFILE);
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>(DEFAULT_WEIGHT_HISTORY);
  const [gallery, setGallery] = useState<GalleryImage[]>(DEFAULT_PHOTO_GALLERY);
  const [dailyLogs, setDailyLogs] = useState<DailyLogState>({
    waterCount: 3, 
    waterTarget: 4, 
    tasks: DEFAULT_DAILY_TASKS
  });
  const [moodHistory, setMoodHistory] = useState<MoodRecord[]>(DEFAULT_MOOD_HISTORY);

  // Hydrate states from localStorage on initialization
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('mochi_profile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed) {
          if (parsed.name === "Mochi" || !parsed.name || parsed.name.trim() === "") {
            parsed.name = "Sún";
          }
          if (parsed.breed === "Orange Tabby Shorthair") {
            parsed.breed = "Grey British shorthair";
          }
          // Restore and enforce Sún's main pet picture as the avatar
          if (!parsed.avatarUrl || parsed.avatarUrl === "" || parsed.avatarUrl.includes("cat_profile") || parsed.avatarUrl.includes("grey_shorthair") || parsed.avatarUrl.includes("sun_avatar")) {
            parsed.avatarUrl = "/src/assets/images/z7899206683246_54ebcab0c13069e1652937072d856d5a.jpg";
          } else if (parsed.avatarUrl.includes("z7899206683246_54ebcab0c13069e1652937072d856d5a.jpg")) {
            parsed.avatarUrl = "/src/assets/images/z7899206683246_54ebcab0c13069e1652937072d856d5a.jpg";
          }
          if (!parsed.bio || parsed.bio.includes("A serene, sleepy orange soul") || parsed.bio.trim() === "") {
            parsed.bio = "sleepy, seriously";
          }
          if (Array.isArray(parsed.personality) && parsed.personality.includes("Katsuobushi Lover")) {
            parsed.personality = parsed.personality.filter((p: string) => p !== "Katsuobushi Lover");
          }
        }
        setProfile(parsed);
      } else {
        // If no stored profile, set default
        setProfile(DEFAULT_CAT_PROFILE);
      }

      const storedWeight = localStorage.getItem('mochi_weight_history');
      if (storedWeight) {
        const parsedWeight = JSON.parse(storedWeight);
        if (Array.isArray(parsedWeight) && parsedWeight.length > 0) {
          // Check if it's the old dataset (first record was ~3.4kg)
          const firstEntry = parsedWeight[0];
          if (firstEntry && (typeof firstEntry.weight === 'number' && firstEntry.weight < 4.0)) {
            setWeightHistory(DEFAULT_WEIGHT_HISTORY);
            localStorage.setItem('mochi_weight_history', JSON.stringify(DEFAULT_WEIGHT_HISTORY));
          } else {
            const lastEntry = parsedWeight[parsedWeight.length - 1];
            if (lastEntry && (lastEntry.weight === 4.5)) {
              lastEntry.weight = "more than 6kg";
            }
            setWeightHistory(parsedWeight);
          }
        } else {
          setWeightHistory(DEFAULT_WEIGHT_HISTORY);
        }
      } else {
        setWeightHistory(DEFAULT_WEIGHT_HISTORY);
      }

      const storedGallery = localStorage.getItem('mochi_gallery');
      if (storedGallery) {
        const parsedGallery = JSON.parse(storedGallery);
        if (Array.isArray(parsedGallery)) {
          // Filter out older placeholders, keep Sún's uploaded files (z7899 series) or custom URLs
          const filteredGallery = parsedGallery.filter((img: any) => {
            if (!img) return false;
            const url = img.url || "";
            if (url.includes("cat_") || url.includes("shorthair") || url.includes("sun_")) return false;
            return true;
          });

          // Merge any missing default photos of Sún (the 9 uploaded pictures) so they are all present
          const mergedGallery = [...filteredGallery];
          DEFAULT_PHOTO_GALLERY.forEach(defImg => {
            const alreadyExists = mergedGallery.some(img => 
              img.url === defImg.url || img.url.includes(defImg.url.split('/').pop() || "NON_EXISTENT")
            );
            if (!alreadyExists) {
              mergedGallery.push(defImg);
            }
          });

          // Sort or keep original order, ensuring valid IDs
          const resolved = mergedGallery.map((img, index) => {
            let url = img.url;
            if (url.includes("z7899") && !url.startsWith("/src/assets/images/")) {
              const filename = url.split('/').pop();
              url = `/src/assets/images/${filename}`;
            }
            return {
              ...img,
              id: img.id || `g-resolved-${index}`,
              url
            };
          });

          setGallery(resolved);
        } else {
          setGallery(DEFAULT_PHOTO_GALLERY);
        }
      } else {
        setGallery(DEFAULT_PHOTO_GALLERY);
      }

      const storedLogs = localStorage.getItem('mochi_daily_logs');
      if (storedLogs) setDailyLogs(JSON.parse(storedLogs));

      const storedMoods = localStorage.getItem('mochi_mood_history');
      if (storedMoods) setMoodHistory(JSON.parse(storedMoods));
    } catch (e) {
      console.error("Local storage load failure", e);
    }
  }, []);

  // Save states back to local storage whenever edits occur
  useEffect(() => {
    localStorage.setItem('mochi_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('mochi_weight_history', JSON.stringify(weightHistory));
  }, [weightHistory]);

  useEffect(() => {
    localStorage.setItem('mochi_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('mochi_daily_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('mochi_mood_history', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const handleUpdateProfile = (updated: CatProfile) => {
    setProfile(updated);
  };

  const handleUpdateWeight = (updated: WeightRecord[]) => {
    setWeightHistory(updated);
  };

  const handleUpdateGallery = (updated: GalleryImage[]) => {
    setGallery(updated);
  };

  const handleUpdateDailyLogs = (updated: DailyLogState) => {
    setDailyLogs(updated);
  };

  const handleUpdateMoodHistory = (updated: MoodRecord[]) => {
    setMoodHistory(updated);
  };

  // Direct sidebar menu definitions
  const NAVIGATION_ITEMS = [
    { id: 'home', label: 'Home (Dashboard)', icon: Sparkles, desc: 'Overview & Story' },
    { id: 'appearance', label: 'Appearance & Color', icon: Palette, desc: 'Fur colors & Album' },
    { id: 'weight', label: 'Weight Tracker', icon: WeightIcon, desc: 'Growth timeline chart' },
    { id: 'behavior', label: 'Behavior & Habits', icon: Smile, desc: 'Daily tasks & Mood' }
  ] as const;

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row relative selection:bg-accent/20">
      
      {/* Decorative Japanese Fan & Cloud Motifs background elements */}
      <div className="absolute top-10 left-[20%] w-72 h-72 bg-accent/2 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-[15%] w-96 h-96 bg-sage/3 rounded-full blur-3xl pointer-events-none" />

      {/* MOBILE HEADER BAR */}
      <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-warm-beige sticky top-0 z-40 px-5 py-4 flex justify-between items-center cozy-shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="bg-accent/10 p-2 rounded-xl text-accent border border-accent/15">
            <Heart className="w-5 h-5 fill-accent/10" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-warm-charcoal tracking-tight">{profile.name}</span>
            <span className="block text-[8px] font-mono uppercase tracking-widest text-sage font-semibold">Care companion dashboard</span>
          </div>
        </div>
        
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-cream border border-warm-beige/80 p-2 rounded-xl text-warm-mocha cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* MOBILE NAVIGATION SIDEBAR EXPANSION BAR */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden fixed inset-x-0 top-[69px] bg-white border-b border-warm-beige z-30 shadow-xl overflow-hidden py-4 animate-fade-in divide-y divide-cream">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-6 py-4 transition-colors text-left ${
                  isActive 
                    ? 'bg-accent/5 text-accent font-bold font-semibold' 
                    : 'text-warm-mocha/80 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-sage'}`} />
                <div>
                  <span className="block text-sm">{item.label}</span>
                  <span className="block text-[9px] font-mono text-sage">{item.desc}</span>
                </div>
              </button>
            );
          })}
        </nav>
      )}

      {/* DESKTOP SIDEBAR PANEL (GLUED LEFT) */}
      <aside className="hidden lg:flex flex-col w-[320px] bg-white/95 border-r border-warm-beige/95 p-8 h-screen sticky top-0 z-30 justify-between cozy-shadow">
        <div className="space-y-10">
          
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 bg-cream/35 border border-warm-beige p-3.5 rounded-[22px]">
            <div className="bg-accent/10 p-2.5 rounded-[15px] border border-accent/20 text-accent">
              <Heart className="w-6 h-6 fill-accent/25 animate-pulse" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-warm-charcoal tracking-tight">companion</h1>
              <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-sage font-bold">{profile.name}'s Diary</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5" id="desktop-sidebar-nav">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-[20px] transition-all text-left group ${
                    isActive 
                      ? 'bg-accent text-white font-bold cozy-shadow-lg scale-102 border-l-[4px] border-amber-300' 
                      : 'hover:bg-cream border border-transparent hover:border-warm-beige/65 text-warm-mocha'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? 'text-white scale-110' : 'text-sage group-hover:scale-110'
                  }`} />
                  <div>
                    <span className="block text-sm font-semibold tracking-wide">{item.label}</span>
                    <span className={`block text-[9px] font-mono font-light tracking-wide ${isActive ? 'text-cream/90' : 'text-sage'}`}>
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Small Cozy footer stats widget */}
        <div className="bg-cream/50 border border-warm-beige rounded-[20px] p-4 text-center space-y-1 text-xs">
          <div className="font-mono text-[10px] text-sage uppercase tracking-wider font-semibold">Caregiver Signature</div>
          <div className="font-serif italic font-bold text-warm-mocha flex items-center justify-center gap-1">
            <Gift className="w-3.5 h-3.5 text-accent" /> {profile.name}'s Parent
          </div>
          <span className="block text-[9px] font-mono text-warm-mocha/55 italic">Local data auto-saved ✔</span>
        </div>

      </aside>

      {/* CORE DISPLAY WINDOW (PADDED SCROLLABLE CONTAINER) */}
      <main className="flex-1 p-5 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden min-h-[80vh]">
        <div className="space-y-6">
          
          {/* Tab Route dispatcher */}
          {activeTab === 'home' && (
            <Dashboard 
              profile={profile}
              weightHistory={weightHistory}
              dailyLogs={dailyLogs}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceSection 
              profile={profile}
              gallery={gallery}
              onUpdateProfile={handleUpdateProfile}
              onUpdateGallery={handleUpdateGallery}
            />
          )}

          {activeTab === 'weight' && (
            <WeightSection 
              weightHistory={weightHistory}
              onUpdateWeight={handleUpdateWeight}
            />
          )}

          {activeTab === 'behavior' && (
            <BehaviorSection 
              profile={profile}
              dailyLogs={dailyLogs}
              moodHistory={moodHistory}
              onUpdateProfile={handleUpdateProfile}
              onUpdateDailyLogs={handleUpdateDailyLogs}
              onUpdateMoodHistory={handleUpdateMoodHistory}
            />
          )}

        </div>

        {/* Decorative Watermark Tag to anchor the geometric Japanese look */}
        <footer className="mt-16 border-t border-warm-beige/65 pt-6 text-center text-[10px] font-mono text-sage tracking-[0.15em] uppercase pb-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <span>{profile.name} Companion Care Panel — Styled in Warm Minimalist Geometric Balance</span>
          <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-warm-beige/80">
            <Info className="w-3.5 h-3.5 text-accent" /> Persistent LocalStorage Ready
          </span>
        </footer>
      </main>

    </div>
  );
}
