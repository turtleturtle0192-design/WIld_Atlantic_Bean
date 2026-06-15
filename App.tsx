import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Coffee, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Menu as MenuIcon, 
  X, 
  Send, 
  ChevronRight, 
  Heart, 
  Info, 
  Sparkles, 
  Instagram, 
  Facebook, 
  ArrowRight, 
  Check, 
  Utensils, 
  Maximize2, 
  MessageSquare,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { menuCategories, galleryItems, teamMembers } from "./data";
import { MenuItem, ChatMessage, GalleryItem } from "./types";

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<"home" | "menu" | "about" | "gallery" | "contact">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Fáilte! Welcome to Wild Atlantic Bean! ☕ I'm Bean-y, your local host from Letterkenny. Ask me anything about our specialty coffee, daily fresh baked scones, or location!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Menu Section State
  const [selectedMenuCategory, setSelectedMenuCategory] = useState("drinks");

  // Gallery Filter State
  const [galleryFilter, setGalleryFilter] = useState<"all" | "food" | "drinks" | "interior" | "exterior">("all");
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Scroll to page top on screen transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  }, [currentPage]);

  // Scroll chat window to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatOpen]);

  // Handle Form Submission
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  // Handle Chat message sending
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");
    setIsTyping(true);

    try {
      // Build history for Gemini (strictly user or model format)
      const conversationalHistory = chatMessages.map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          history: conversationalHistory
        })
      });

      const data = await res.json();
      
      const responseMsg: ChatMessage = {
        id: `gemini-${Date.now()}`,
        role: "model",
        text: data.text || "I was gazing out the window in County Donegal and lost my train of thought, simple mistake!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages((prev) => [...prev, responseMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `gemini-err-${Date.now()}`,
        role: "model",
        text: "I might be experiencing a little north-west internet wind there, let us try again or check our contact card for quick answers!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#fbf9f6] text-cafe-charcoal selection:bg-cafe-gold-light selection:text-cafe-forest">
      
      {/* ----------------- GLOBAL HEADER / NAVBAR ----------------- */}
      <header className="sticky top-0 z-40 bg-[#fbf9f6]/95 backdrop-blur-md border-b border-cafe-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo area */}
            <button 
              onClick={() => setCurrentPage("home")}
              className="flex items-center space-x-3 group text-left cursor-pointer focus:outline-none"
              id="nav-logo-btn"
            >
              <div className="w-12 h-12 rounded-full bg-cafe-forest flex items-center justify-center text-cafe-gold shadow-md group-hover:scale-105 transition-transform duration-300">
                <Coffee className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-cafe-forest leading-none">
                  Wild Atlantic Bean
                </span>
                <span className="block text-[10px] tracking-widest text-cafe-gold uppercase font-mono font-medium">
                  Letterkenny • Donegal Welcome
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { id: "home", label: "Home" },
                { id: "menu", label: "Our Menu" },
                { id: "about", label: "About Us" },
                { id: "gallery", label: "Gallery" },
                { id: "contact", label: "Contact & Visit" }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                    currentPage === link.id
                      ? "bg-cafe-forest text-[#fbf9f6] shadow-sm"
                      : "text-cafe-charcoal hover:bg-cafe-cream/40 hover:text-cafe-forest"
                  }`}
                  id={`nav-link-${link.id}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop Action Banner */}
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage("contact")} 
                className="bg-cafe-gold text-[#fbf9f6] px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider hover:bg-[#b08d4b] hover:shadow-md transition-all duration-300 uppercase cursor-pointer"
                id="cta-visit-header"
              >
                Find Us
              </button>
            </div>

            {/* Mobile Hamburger Handle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-cafe-forest hover:bg-cafe-cream/30 focus:outline-none"
                aria-label="Toggle Menu"
                id="mobile-menu-burger"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-[#fbf9f6] border-t border-cafe-gold/15 overflow-hidden"
              id="mobile-menu-drawer"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {[
                  { id: "home", label: "Home" },
                  { id: "menu", label: "Our Menu" },
                  { id: "about", label: "About Us" },
                  { id: "gallery", label: "Gallery" },
                  { id: "contact", label: "Contact & Visit" }
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => setCurrentPage(link.id as any)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium ${
                      currentPage === link.id
                        ? "bg-cafe-forest text-[#fbf9f6]"
                        : "text-cafe-charcoal hover:bg-cafe-cream/30"
                    }`}
                    id={`mobile-nav-link-${link.id}`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-cafe-gold/10">
                  <button
                    onClick={() => setCurrentPage("contact")}
                    className="flex w-full justify-center bg-cafe-gold text-[#fbf9f6] py-3 rounded-xl text-sm font-semibold tracking-wider uppercase text-center"
                    id="mobile-cta-header"
                  >
                    Visit Us Today
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ----------------- CORE VIEWS PAGE COMPONENT ----------------- */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* ========================================================= */}
          {/* 1. HOME VIEW                                              */}
          {/* ========================================================= */}
          {currentPage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-20 pb-20"
            >
              
              {/* Hero Banner Section */}
              <section className="relative overflow-hidden bg-cafe-forest text-[#fbf9f6] py-20 lg:py-32">
                <div className="absolute inset-0 opacity-15 mix-blend-overlay">
                  <img
                    src="/src/assets/images/hero_interior_1781517931951.jpg"
                    alt="Vintage background texture"
                    className="w-full h-full object-cover scale-105 filter blur-xs"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Decorative Shamrock/Foliage backdrop */}
                <div className="absolute right-0 bottom-0 w-80 h-80 opacity-5 pointer-events-none">
                  <Sparkle className="w-full h-full text-[#fbf9f6]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Hero Left Content */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                      <div className="inline-flex items-center space-x-2 bg-cafe-cream/10 border border-cafe-gold-light/25 px-4 py-1.5 rounded-full">
                        <Sparkles className="w-4 h-4 text-cafe-gold" />
                        <span className="text-xs font-mono tracking-widest text-cafe-gold uppercase font-medium">
                          Award-Winning Community Hub
                        </span>
                      </div>
                      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#fbf9f6] leading-tight">
                        Fresh Coffee <br />
                        <span className="text-cafe-gold italic">Good Food</span> • Donegal Welcome
                      </h1>
                      <p className="text-base sm:text-lg text-cafe-cream/80 max-w-2xl mx-auto lg:mx-0 font-light">
                        Step in from the Letterkenny breeze to cozy wood fire aesthetics, vibrant greenery, and the rich aroma of locally-roasted independent beans. Your perfect kitchen-away-from-home awaits.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-4">
                        <button
                          onClick={() => setCurrentPage("menu")}
                          className="w-full sm:w-auto bg-cafe-gold hover:bg-[#b08d4b] text-[#fbf9f6] px-8 py-4 rounded-full font-semibold tracking-wide shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                          id="hero-view-menu-btn"
                        >
                          Explore Our Menu <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCurrentPage("contact")}
                          className="w-full sm:w-auto bg-[#fbf9f6]/10 hover:bg-[#fbf9f6]/15 text-[#fbf9f6] border border-[#fbf9f6]/25 hover:border-[#fbf9f6]/40 px-8 py-4 rounded-full font-semibold tracking-wide transition-all duration-300 text-center cursor-pointer"
                          id="hero-visit-us-btn"
                        >
                          Find Our Location
                        </button>
                      </div>
                    </div>

                    {/* Hero Right Media */}
                    <div className="lg:col-span-5 flex justify-center">
                      <div className="relative group p-3">
                        <div className="absolute inset-0 bg-cafe-gold/30 rounded-3xl rotate-3 scale-102 group-hover:rotate-1 group-hover:scale-104 transition-all duration-500"></div>
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-cafe-charcoal max-w-md">
                          <img
                            src="/src/assets/images/hero_interior_1781517931951.jpg"
                            alt="Inside the cozy Wild Atlantic Bean Café with warm wooden architecture and lush green hanging climbing plants"
                            className="w-full h-auto object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* 3 Column Quick Highlights */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  
                  <div className="p-8 rounded-2xl bg-[#f4eae1]/30 border border-cafe-gold/10 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-cafe-forest/5 flex items-center justify-center text-cafe-forest mb-5">
                      <Coffee className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-cafe-forest mb-2">Artisanal Roasts</h3>
                    <p className="text-sm text-cafe-charcoal/70">
                      Carefully sourced direct-trade beans, air-roasted local batches right in County Donegal for full vibrant flavor layers.
                    </p>
                  </div>

                  <div className="p-8 rounded-2xl bg-[#f4eae1]/30 border border-cafe-gold/10 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-cafe-forest/5 flex items-center justify-center text-cafe-forest mb-5">
                      <Utensils className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-cafe-forest mb-2">Donegal Ingredients</h3>
                    <p className="text-sm text-cafe-charcoal/70">
                      From farm-fresh free-range eggs to rich local dairy cream and bay oak-smoked fish, we support the community.
                    </p>
                  </div>

                  <div className="p-8 rounded-2xl bg-[#f4eae1]/30 border border-cafe-gold/10 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-cafe-forest/5 flex items-center justify-center text-cafe-forest mb-5">
                      <Clock className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-cafe-forest mb-2">Warmest Welcome</h3>
                    <p className="text-sm text-cafe-charcoal/70">
                      Our spaces provide lush foliage and comfortable seating panels. Ideal for catching up or focus tasks.
                    </p>
                  </div>

                </div>
              </section>

              {/* Featured Menu Teaser List */}
              <section className="bg-cafe-forest/5 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-xs font-mono font-bold tracking-widest text-cafe-gold uppercase">
                      From Our Kitchen
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cafe-forest mt-2 mb-4">
                      Top Featured Favourites
                    </h2>
                    <p className="text-sm text-cafe-charcoal/80">
                      A small preview of the hand-crafted foods and designer espresso drinks crafted daily by team Siobhán and Liam.
                    </p>
                  </div>

                  {/* 3 Featured Cards inside Home */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Featured Item 1 */}
                    <div className="bg-[#fbf9f6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-cafe-gold/10 group transition-all duration-300">
                      <div className="h-56 relative overflow-hidden bg-cafe-charcoal">
                        <img 
                          src="/src/assets/images/coffee_cup_1781517947479.jpg" 
                          alt="Specialty flat white with feather latte art" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 right-4 bg-cafe-forest text-[#fbf9f6] text-[10px] font-mono tracking-wider uppercase px-3 py-1 rounded-full">
                          Signature Beverage
                        </span>
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="flex justify-between items-center bg-cafe-beige/50 px-3 py-1.5 rounded-lg">
                          <h4 className="font-serif text-lg font-bold text-cafe-forest">Flat White</h4>
                          <span className="font-mono text-xs font-bold text-[#b08d4b]">€4.20</span>
                        </div>
                        <p className="text-xs text-cafe-charcoal/70 leading-relaxed">
                          A velvety, expertly-balanced blend of rich double ristretto espresso and sweet, creamy microfoam poured elegantly.
                        </p>
                      </div>
                    </div>

                    {/* Featured Item 2 */}
                    <div className="bg-[#fbf9f6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-cafe-gold/10 group transition-all duration-300">
                      <div className="h-56 relative overflow-hidden bg-cafe-charcoal">
                        <img 
                          src="https://picsum.photos/seed/breakfast-irish/800/600" 
                          alt="Hearty full Irish Breakfast" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 right-4 bg-cafe-gold text-[#fbf9f6] text-[10px] font-mono tracking-wider uppercase px-3 py-1 rounded-full">
                          Traditional Roast
                        </span>
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="flex justify-between items-center bg-cafe-beige/50 px-3 py-1.5 rounded-lg">
                          <h4 className="font-serif text-lg font-bold text-cafe-forest">Full Irish</h4>
                          <span className="font-mono text-xs font-bold text-[#b08d4b]">€12.95</span>
                        </div>
                        <p className="text-xs text-cafe-charcoal/70 leading-relaxed">
                          Donegal pork sausages, center-cut bacon rasher, free-range egg, white & black pudding, hand-baked warm family wheaten bread.
                        </p>
                      </div>
                    </div>

                    {/* Featured Item 3 */}
                    <div className="bg-[#fbf9f6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-cafe-gold/10 group transition-all duration-300">
                      <div className="h-56 relative overflow-hidden bg-cafe-charcoal">
                        <img 
                          src="/src/assets/images/pastries_scones_1781517964661.jpg" 
                          alt="Fresh scones on golden plate with cream" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 right-4 bg-cafe-forest text-[#fbf9f6] text-[10px] font-mono tracking-wider uppercase px-3 py-1 rounded-full">
                          Fresh Baked
                        </span>
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="flex justify-between items-center bg-cafe-beige/50 px-3 py-1.5 rounded-lg">
                          <h4 className="font-serif text-lg font-bold text-cafe-forest">Buttermilk Scones</h4>
                          <span className="font-mono text-xs font-bold text-[#b08d4b]">€4.75</span>
                        </div>
                        <p className="text-xs text-cafe-charcoal/70 leading-relaxed">
                          Buttermilk scones baked daily at dawn. Served warm with authentic local unpasteurized farmhouse jam and thick clotted cream.
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="text-center pt-10">
                    <button
                      onClick={() => setCurrentPage("menu")}
                      className="inline-flex items-center space-x-2 text-cafe-forest font-semibold hover:text-cafe-gold transition-colors duration-300 group cursor-pointer"
                      id="view-all-home-teaser-btn"
                    >
                      <span>Explore the Full Menu Lists</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Opening Hours & Map Snapshot section on Home */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#f4eae1]/20 rounded-3xl p-8 sm:p-12 border border-cafe-gold/10">
                  
                  {/* Hours details Left */}
                  <div className="lg:col-span-5 space-y-6">
                    <span className="text-xs font-mono font-bold tracking-widest text-cafe-gold uppercase">
                      Gather with Us
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cafe-forest">
                      Donegal Opening Hours & Location
                    </h2>
                    <p className="text-sm text-cafe-charcoal/70">
                      Located on Main Street in the heart of Letterkenny, Co. Donegal, F92 XY34. We're open seven days a week serving fresh craft grinds and hot brunch. Walk-ins are always welcome.
                    </p>

                    <div className="divide-y divide-cafe-gold/15 border-y border-cafe-gold/15 py-4">
                      <div className="flex justify-between py-2 text-sm">
                        <span className="font-medium text-cafe-charcoal">Monday – Friday</span>
                        <span className="font-semibold text-cafe-forest">8:00 AM – 6:00 PM</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm">
                        <span className="font-medium text-cafe-charcoal">Saturday</span>
                        <span className="font-semibold text-cafe-forest">9:00 AM – 6:00 PM</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm">
                        <span className="font-medium text-cafe-charcoal">Sunday</span>
                        <span className="font-semibold text-cafe-forest">10:00 AM – 5:00 PM</span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-cafe-charcoal/60 flex items-center gap-2">
                      <Info className="w-4 h-4 text-cafe-gold shrink-0" />
                      <span>Special bank holidays may affect sunday schedules. Check our socials!</span>
                    </div>
                  </div>

                  {/* Interactive Map Visual Right */}
                  <div className="lg:col-span-7 bg-[#ededed] h-72 sm:h-96 rounded-2xl relative overflow-hidden border border-cafe-gold/15 flex flex-col justify-between p-6">
                    {/* SVG Map Lines Backdrop */}
                    <div className="absolute inset-0 opacity-40">
                      <svg width="100%" height="100%" className="text-cafe-forest/20">
                        <path d="M0,50 Q100,60 200,40 T400,80 T600,20 T800,100" fill="none" stroke="currentColor" strokeWidth="6" />
                        <path d="M50,0 Q60,100 40,200 T80,400 T20,600 T100,800" fill="none" stroke="currentColor" strokeWidth="6" />
                        <path d="M100,200 L600,350" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="5,5" />
                        <circle cx="320" cy="180" r="160" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M120,0 L240,400" fill="none" stroke="currentColor" strokeWidth="8" />
                        {/* River Swilly representation */}
                        <path d="M-50,280 C200,300 400,250 850,290" fill="none" stroke="#2563eb" strokeWidth="18" strokeLinecap="round" className="opacity-40" />
                      </svg>
                    </div>

                    {/* Cafe pin graphic indicator */}
                    <div className="absolute left-[45%] top-[40%] flex flex-col items-center">
                      <span className="absolute animate-ping inline-flex h-10 w-10 rounded-full bg-cafe-forest opacity-30"></span>
                      <div className="relative z-10 w-12 h-12 rounded-full bg-cafe-forest flex items-center justify-center text-cafe-gold shadow-lg ring-4 ring-[#fbf9f6]">
                        <Coffee className="w-6 h-6 animate-bounce" />
                      </div>
                      <div className="mt-1 bg-cafe-forest/95 backdrop-blur-xs text-[#fbf9f6] text-[10px] font-mono px-3 py-1 rounded-md min-w-max shadow-md font-bold tracking-wider">
                        WILD ATLANTIC BEAN
                      </div>
                    </div>

                    {/* Street references */}
                    <span className="absolute left-6 top-3 text-[10px] uppercase tracking-widest font-mono text-cafe-charcoal/40 font-bold">Donegal Rd / N56</span>
                    <span className="absolute right-10 bottom-4 text-[10px] uppercase tracking-widest font-mono text-cafe-charcoal/40 font-bold">Port Rd / Main Street</span>

                    <div className="relative z-10 self-end mt-auto bg-[#fbf9f6]/95 backdrop-blur-md p-4 rounded-xl border border-cafe-gold/25 shadow-lg max-w-xs text-left">
                      <h4 className="font-serif font-bold text-sm text-cafe-forest">Letterkenny Central</h4>
                      <p className="text-xs text-cafe-charcoal/80 mt-1 leading-relaxed">
                        F92 XY34, Main Street (Opposite the old Market Square). Walking distance from public carparks.
                      </p>
                      <button 
                        onClick={() => setCurrentPage("contact")}
                        className="mt-2.5 text-[10px] font-bold text-cafe-gold hover:text-cafe-forest flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Open Detailed Directions</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              </section>

            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 2. MENU VIEW                                              */}
          {/* ========================================================= */}
          {currentPage === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
            >
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold tracking-widest text-cafe-gold uppercase">
                  Gastronomy & Grinds
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cafe-forest mt-2 mb-4">
                  Our Specialty Menu
                </h1>
                <p className="text-sm text-cafe-charcoal/80">
                  Every pastry is kneaded by hand, breakfasts are cooked to golden order, and our specialty coffee extract is timed to precise barista weight parameters. Refreshingly local.
                </p>
              </div>

              {/* Menu Categories Tabs selectors */}
              <div className="flex flex-wrap justify-center gap-2 border-b border-cafe-gold/15 pb-4">
                {menuCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedMenuCategory(cat.id)}
                    className={`px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                      selectedMenuCategory === cat.id
                        ? "bg-cafe-forest text-[#fbf9f6] shadow-md"
                        : "text-cafe-charcoal hover:bg-cafe-cream/40 hover:text-cafe-forest"
                    }`}
                    id={`menu-tab-${cat.id}`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              {/* Live Rendered Category Content */}
              <AnimatePresence mode="wait">
                {menuCategories.filter(c => c.id === selectedMenuCategory).map((cat) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-10"
                  >
                    <div className="text-center md:text-left bg-cafe-cream/20 border-l-4 border-cafe-gold px-6 py-4 rounded-r-xl">
                      <p className="text-sm text-cafe-charcoal/80 font-medium italic">{cat.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {cat.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white p-6 rounded-2xl shadow-xs border border-cafe-gold/5 flex flex-col justify-between hover:shadow-sm hover:border-cafe-gold/20 transition-all duration-300 relative overflow-hidden"
                          id={`menu-item-${idx}`}
                        >
                          {item.isFeatured && (
                            <div className="absolute right-0 top-0 bg-cafe-gold/20 text-cafe-forest text-[9px] font-mono font-bold uppercase tracking-wider py-1 px-3 rounded-bl-xl border-l border-b border-cafe-gold-light/40">
                              House Special
                            </div>
                          )}
                          <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-serif text-lg font-bold text-cafe-charcoal flex items-center gap-2">
                                {item.name}
                              </h3>
                              <span className="font-mono text-sm font-bold text-cafe-gold text-right shrink-0">
                                €{item.price.toFixed(2)}
                              </span>
                            </div>

                            {/* Tags list */}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {item.tags.map((t, tIdx) => (
                                  <span 
                                    key={tIdx} 
                                    className="text-[9px] font-mono bg-cafe-cream uppercase text-cafe-forest/90 px-2 py-0.5 rounded font-medium tracking-wide"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}

                            <p className="text-xs text-cafe-charcoal/70 line-clamp-2 pr-4 pt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Sourcing & Allergens Note block */}
              <div className="bg-cafe-forest text-cafe-cream p-8 sm:p-12 rounded-3xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5 pointer-events-none w-64 h-64">
                  <Coffee className="w-full h-full stroke-[0.5]" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="inline-flex items-center space-x-2 bg-cafe-cream/10 px-3 py-1 rounded-full text-cafe-gold">
                      <Sparkle className="w-4 h-4" />
                      <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">Donegal Agriculture Pride</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#fbf9f6]">Our Proud Local Sourcing Values</h3>
                    <p className="text-xs text-cafe-cream/80 leading-relaxed max-w-2xl">
                      County Donegal holds some of Ireland's best small dairy and wheat producers. We source our milk from certified green dairy herds in Raphoe, buy free-range woodland eggs from small family runs on the Fanad peninsula, and purchase fresh oat cereals and unpasteurized organic hand-mashed strawberry preserves directly from local growers.
                    </p>
                  </div>
                  
                  <div className="lg:col-span-4 bg-[#fbf9f6]/5 p-6 rounded-2xl border border-cafe-gold/20 space-y-3">
                    <h4 className="font-sans font-bold text-xs text-cafe-gold uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-4 h-4 shrink-0" /> Allergen Information
                    </h4>
                    <p className="text-[10px] text-cafe-cream/70 leading-relaxed">
                      Our pastry items and breads are baked in a kitchen that handles wheat, walnuts, gluten, celery, and nuts. Gluten-Free (GF) bun/bread replacements and vegan organic plant-based milks (Oat, Almond, Coconut) are available upon request. Please announce severe dietary limits to our cashiers.
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 3. ABOUT US VIEW                                          */}
          {/* ========================================================= */}
          {currentPage === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20"
            >
              
              {/* Introduction Story section */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Visual Left */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative p-2 w-full max-w-md">
                    <div className="absolute inset-0 bg-[#eeded6] rounded-3xl -rotate-2 scale-102"></div>
                    <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-square bg-cafe-charcoal">
                      <img 
                        src="https://picsum.photos/seed/donegal-landscape/800/800" 
                        alt="Dramatic beautiful wild cliffs of Donegal inspiring the brand" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                {/* Narrative Right */}
                <div className="lg:col-span-7 space-y-6">
                  <span className="text-xs font-mono font-bold tracking-widest text-cafe-gold uppercase">
                    The Warm Story
                  </span>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cafe-forest">
                    Rooted in letterkenny & Inspired by the Wild Atlantic Waves
                  </h1>
                  
                  <div className="space-y-4 text-sm text-cafe-charcoal/80 leading-relaxed font-light">
                    <p>
                      Wild Atlantic Bean was founded by Ciarán Doherty with a straightforward dream: to establish a warm, modern third-wave coffee destination in County Donegal that holds the authentic character of historical Irish kitchens. 
                    </p>
                    <p>
                      Our name is a proud salute to the rugged, breathtaking Wild Atlantic Way. We look at coffee roasting as a beautiful mixture of meticulous science and traditional Irish patience. We spend hours testing roast temperature adjustments, timing extractions, and tasting beans with the same attention our grandmothers paid to baking soda bread on open stoves.
                    </p>
                    <p>
                      Our café interior is custom-styled with recycled cedar planks, hanging green ivy leaves, and massive windows to let Letterkenny's variable sky wash the lounge with light. It is a genuine community space built for focused laptop workers, warm family catch-ups, or a peaceful single escape over a double espresso.
                    </p>
                  </div>
                </div>
              </section>

              {/* Three Core Pillars of Values */}
              <section className="bg-cafe-cream/20 rounded-3xl p-8 sm:p-12 border border-cafe-gold/15">
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <span className="text-xs font-mono font-bold tracking-widest text-cafe-gold uppercase">
                    What Drives Us
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cafe-forest mt-1">
                    Our Core Café Principles
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Pillar 1 */}
                  <div className="bg-[#fbf9f6] p-6 rounded-2xl border border-cafe-gold/10 space-y-3 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-cafe-forest/5 flex items-center justify-center text-cafe-forest font-serif font-bold italic">1</div>
                    <h3 className="font-serif text-lg font-bold text-cafe-forest">Specialty Integrity</h3>
                    <p className="text-xs text-cafe-charcoal/70 leading-relaxed">
                      We never cut quality corners. Our coffee beans are fully traceable, sourced via fair direct-trade relationships, and graded "Specialty Class" to treat coffee with total modern respect.
                    </p>
                  </div>

                  {/* Pillar 2 */}
                  <div className="bg-[#fbf9f6] p-6 rounded-2xl border border-cafe-gold/10 space-y-3 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-cafe-forest/5 flex items-center justify-center text-cafe-forest font-serif font-bold italic">2</div>
                    <h3 className="font-serif text-lg font-bold text-cafe-forest">Local Co-Agriculture</h3>
                    <p className="text-xs text-cafe-charcoal/70 leading-relaxed">
                      We believe a local independent café's true strength lies in its surrounding environment. We source our flour, eggs, seasonal fruits, and butter within Donegal to keep the regional food cycle alive.
                    </p>
                  </div>

                  {/* Pillar 3 */}
                  <div className="bg-[#fbf9f6] p-6 rounded-2xl border border-cafe-gold/10 space-y-3 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-cafe-forest/5 flex items-center justify-center text-cafe-forest font-serif font-bold italic">3</div>
                    <h3 className="font-serif text-lg font-bold text-cafe-forest">Conscious Ecology</h3>
                    <p className="text-xs text-cafe-charcoal/70 leading-relaxed">
                      From using fully plant-based takeout mugs and bio-degradable straw accessories, to recycling our organic coffee grounds into local community garden composts, we protect the beautiful Donegal soil.
                    </p>
                  </div>
                </div>
              </section>

              {/* Team Profile Grid */}
              <section className="space-y-12">
                <div className="text-center max-w-3xl mx-auto">
                  <span className="text-xs font-mono font-bold tracking-widest text-cafe-gold uppercase">
                    The Friendly Faces
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cafe-forest mt-1">
                    Meet Our Letterkenny Team
                  </h2>
                  <p className="text-xs text-cafe-charcoal/70 mt-2">
                    A modest group of passionate food, design, and extraction lovers dedicated to preparing your morning smiles.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {teamMembers.map((member, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-md border border-cafe-gold/10 transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="h-64 relative bg-cafe-charcoal overflow-hidden">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover object-center filter saturate-[0.85] hover:saturate-100 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cafe-charcoal/50 to-transparent"></div>
                      </div>
                      
                      <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-serif text-lg font-bold text-cafe-forest">{member.name}</h3>
                          <p className="font-mono text-[10px] text-cafe-gold uppercase tracking-wider font-semibold">{member.role}</p>
                        </div>
                        <p className="text-xs text-cafe-charcoal/80 leading-relaxed flex-grow font-light">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 4. GALLERY VIEW WITH FILTER AND LIGHTBOX                    */}
          {/* ========================================================= */}
          {currentPage === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
            >
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold tracking-widest text-cafe-gold uppercase">
                  Cozy Frames
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cafe-forest mt-2 mb-4">
                  Café Visual Gallery
                </h1>
                <p className="text-sm text-cafe-charcoal/80">
                  Take a digital stroll around our Letterkenny café space, view our culinary treats, freshly served drinks, and cozy wooden lounge corners.
                </p>
              </div>

              {/* Gallery Filter controls */}
              <div className="flex flex-wrap justify-center gap-2 border-b border-cafe-gold/15 pb-4">
                {[
                  { value: "all", label: "All Photos" },
                  { value: "food", label: "Gourmet Foods" },
                  { value: "drinks", label: "Drinks & Coffee" },
                  { value: "interior", label: "Cozy Interior" },
                  { value: "exterior", label: "Main Street Front" }
                ].map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setGalleryFilter(btn.value as any)}
                    className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      galleryFilter === btn.value
                        ? "bg-cafe-gold text-[#fbf9f6] shadow-sm font-semibold"
                        : "text-cafe-charcoal hover:bg-cafe-cream/40"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Gallery Photo Grid container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleryItems
                  .filter(item => galleryFilter === "all" || item.category === galleryFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setLightboxImage(item)}
                      className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-cafe-charcoal border border-cafe-gold/5 shadow-2xs hover:shadow-md cursor-pointer transition-all duration-500"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-106 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {/* Hover reveal overlay color fade */}
                      <div className="absolute inset-0 bg-cafe-forest/80 backdrop-blur-3xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
                          <span className="text-[9px] font-mono font-semibold text-cafe-gold uppercase tracking-widest block">
                            {item.category}
                          </span>
                          <p className="text-xs text-[#fbf9f6] font-medium leading-relaxed font-serif line-clamp-3">
                            {item.alt}
                          </p>
                          <span className="inline-flex items-center text-[10px] text-cafe-gold font-bold gap-1 mt-1.5 border-b border-cafe-gold/40 pb-0.5">
                            Expand Image <Maximize2 className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Lightbox Modal display */}
              <AnimatePresence>
                {lightboxImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                  >
                    {/* Inner frame */}
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95 }}
                      className="relative max-w-4xl w-full bg-cafe-charcoal rounded-3xl overflow-hidden shadow-2xl border border-cafe-gold/20 flex flex-col justify-between"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-[#fbf9f6] focus:outline-none cursor-pointer"
                        aria-label="Close Lightbox"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Photo Area */}
                      <div className="max-h-[65vh] overflow-hidden bg-black flex justify-center items-center">
                        <img
                          src={lightboxImage.src}
                          alt={lightboxImage.alt}
                          className="max-h-[65vh] max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Caption details Area */}
                      <div className="bg-[#2c2520] p-6 border-t border-cafe-gold/15 space-y-1">
                        <span className="text-xs font-mono font-bold text-cafe-gold uppercase tracking-wider block">
                          Category: {lightboxImage.category}
                        </span>
                        <p className="font-serif text-sm sm:text-base text-cafe-cream/95 leading-relaxed">
                          {lightboxImage.alt}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 5. CONTACT VIEW                                           */}
          {/* ========================================================= */}
          {currentPage === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
            >
              
              <div className="text-center max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold tracking-widest text-cafe-gold uppercase">
                  Let's Connect
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-cafe-forest mt-2 mb-4">
                  Contact & Visit Us
                </h1>
                <p className="text-sm text-cafe-charcoal/80">
                  Drop us an email, ring our Letterkenny team, chat over business WhatsApp, or swing by our Main Street location for fresh sips!
                </p>
              </div>

              {/* Grid block for information details vs Contact Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Contact Columns Details Left */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* Address, Phone, Email visual boxes */}
                  <div className="space-y-4">
                    
                    {/* Place address */}
                    <div className="flex gap-4 p-5 rounded-2xl bg-cafe-cream/20 border border-cafe-gold/10">
                      <div className="w-10 h-10 rounded-full bg-cafe-forest/5 flex items-center justify-center text-cafe-forest shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-sans font-bold text-sm text-cafe-forest">Our Café Address</h4>
                        <p className="text-xs text-cafe-charcoal/80 leading-relaxed font-light">
                          Main Street, Letterkenny, County Donegal,<br />
                          F92 XY34, Ireland
                        </p>
                      </div>
                    </div>

                    {/* Phone Call link */}
                    <a 
                      href="tel:+353749123456" 
                      className="flex gap-4 p-5 rounded-2xl bg-cafe-cream/20 border border-cafe-gold/10 hover:border-cafe-gold/30 hover:bg-cafe-cream/30 transition-all duration-300 block text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-cafe-forest/5 flex items-center justify-center text-cafe-forest shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-sans font-bold text-sm text-cafe-forest">Click-to-Call</h4>
                        <p className="text-xs text-cafe-charcoal/80 font-bold tracking-wide">
                          +353 74 912 3456
                        </p>
                        <span className="text-[10px] text-cafe-gold font-semibold uppercase tracking-wider block pt-0.5">
                          Tap to call Letterkenny cashiers
                        </span>
                      </div>
                    </a>

                    {/* Direct Email link */}
                    <a 
                      href="mailto:hello@wildatlanticbean.ie" 
                      className="flex gap-4 p-5 rounded-2xl bg-cafe-cream/20 border border-cafe-gold/10 hover:border-cafe-gold/30 hover:bg-cafe-cream/30 transition-all duration-300 block text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-cafe-forest/5 flex items-center justify-center text-cafe-forest shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-sans font-bold text-sm text-cafe-forest">Direct Email Link</h4>
                        <p className="text-xs text-cafe-charcoal/80 text-cafe-forest font-semibold underline">
                          hello@wildatlanticbean.ie
                        </p>
                        <span className="text-[10px] text-cafe-gold font-semibold uppercase tracking-wider block pt-0.5">
                          Send general queries or group event questions
                        </span>
                      </div>
                    </a>

                  </div>

                  {/* Gigantic Clickable Business WhatsApp Button */}
                  <div className="p-6 rounded-2xl bg-[#25d366]/10 border border-[#25d366]/30 space-y-3">
                    <h4 className="font-sans font-bold text-sm text-[#128c7e] flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#128c7e]" /> Live Business WhatsApp
                    </h4>
                    <p className="text-xs text-cafe-charcoal/80 leading-relaxed font-light">
                      Need a quick coffee tray order query or breakfast menu confirmation for your workspace? Send our crew a quick text on WhatsApp Business instantly! Available during cafe hours.
                    </p>
                    <a
                      href="https://wa.me/353749123456"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center space-x-2 w-full bg-[#25d366] hover:bg-[#128c7e] text-white py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 text-center cursor-pointer"
                      id="whatsapp-direct-btn"
                    >
                      <MessageSquare className="w-5 h-5 fill-white stroke-none" />
                      <span>Start Chat on WhatsApp Business</span>
                    </a>
                  </div>

                  {/* Social media connections */}
                  <div className="space-y-3 p-5 border border-cafe-gold/10 rounded-2xl">
                    <h4 className="text-xs font-sans font-bold text-cafe-forest uppercase tracking-wider">Social Presence</h4>
                    <div className="flex gap-3">
                      <a 
                        href="https://instagram.com/wildatlanticbean" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full bg-cafe-cream hover:bg-cafe-gold hover:text-white transition-colors flex items-center justify-center text-cafe-forest"
                        aria-label="Instagram Link"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-10 h-10 rounded-full bg-cafe-cream hover:bg-cafe-gold hover:text-white transition-colors flex items-center justify-center text-cafe-forest"
                        aria-label="Facebook Link"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    </div>
                  </div>

                </div>

                {/* Form and Google Map Right Columns */}
                <div className="lg:col-span-7 space-y-12">
                  
                  {/* Contact Form Container */}
                  <div className="bg-white p-8 rounded-3xl border border-cafe-gold/10 shadow-xs relative">
                    <AnimatePresence>
                      {formSubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute inset-x-8 inset-y-8 bg-white flex flex-col items-center justify-center text-center space-y-4"
                        >
                          <div className="w-16 h-16 rounded-full bg-[#1e3f20]/5 flex items-center justify-center text-[#1e3f20]">
                            <Check className="w-8 h-8 stroke-[3]" />
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-cafe-forest">Go Raibh Maith Agat!</h3>
                          <p className="text-sm text-cafe-charcoal/80 max-w-md">
                            Thank you so much! Your detailed mail message has successfully flown over to our Letterkenny coffee shop team. We will write back to you shortly!
                          </p>
                          <button
                            onClick={() => setFormSubmitted(false)}
                            className="text-xs font-mono font-bold text-cafe-gold underline hover:text-cafe-forest"
                          >
                            Send another message
                          </button>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <h3 className="font-serif text-xl font-bold text-cafe-forest mb-6">Send Us a Direct Message</h3>
                    
                    <form onSubmit={handleContactSubmit} className="space-y-5" id="cafe-contact-form">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label htmlFor="form-name" className="block text-xs font-bold text-cafe-charcoal/70 uppercase font-mono">Your Name</label>
                          <input
                            type="text"
                            id="form-name"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full bg-cafe-beige/60 border border-cafe-gold/20 focus:border-cafe-forest focus:ring-1 focus:ring-cafe-forest rounded-xl px-4 py-3 text-xs text-cafe-charcoal font-sans transition-colors outline-none"
                            placeholder="Aodhán Doherty"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="form-email" className="block text-xs font-bold text-cafe-charcoal/70 uppercase font-mono">Your Email Address</label>
                          <input
                            type="email"
                            id="form-email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full bg-cafe-beige/60 border border-cafe-gold/20 focus:border-cafe-forest focus:ring-1 focus:ring-cafe-forest rounded-xl px-4 py-3 text-xs text-cafe-charcoal font-sans transition-colors outline-none"
                            placeholder="aodhan@example.ie"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="form-subject" className="block text-xs font-bold text-cafe-charcoal/70 uppercase font-mono">Subject Message</label>
                        <input
                          type="text"
                          id="form-subject"
                          required
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full bg-cafe-beige/60 border border-cafe-gold/20 focus:border-cafe-forest focus:ring-1 focus:ring-cafe-forest rounded-xl px-4 py-3 text-xs text-cafe-charcoal font-sans transition-colors outline-none"
                          placeholder="Special event reservation request, group booking, supplier, etc."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="form-message" className="block text-xs font-bold text-cafe-charcoal/70 uppercase font-mono">Your Message</label>
                        <textarea
                          id="form-message"
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full bg-cafe-beige/60 border border-cafe-gold/20 focus:border-cafe-forest focus:ring-1 focus:ring-cafe-forest rounded-xl px-4 py-3.5 text-xs text-cafe-charcoal font-sans transition-colors outline-none resize-none"
                          placeholder="Type your query regarding catering, dietary menus, or other info..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full bg-cafe-forest hover:bg-[#1a381c] disabled:bg-cafe-charcoal/30 text-[#fbf9f6] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                        id="form-submit-btn"
                      >
                        {formLoading ? "Flying Over..." : "Submit Message To Crew"}
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Fully visual vector mock model of Letterkenny Google Maps */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-cafe-forest uppercase font-mono tracking-wider">Historical Marker Map Location</h4>
                    <div className="bg-[#ededed] h-80 rounded-3xl relative overflow-hidden border border-cafe-gold/15 flex flex-col justify-between p-6">
                      
                      {/* Detailed Road lines backdrop map */}
                      <div className="absolute inset-0 opacity-40">
                        <svg width="100%" height="100%" className="text-cafe-forest/20">
                          <path d="M0,80 Q150,110 300,50 T600,120 T900,10" fill="none" stroke="currentColor" strokeWidth="6" />
                          <path d="M40,0 Q120,180 80,340 T100,580 T10,800" fill="none" stroke="currentColor" strokeWidth="6" />
                          <circle cx="320" cy="180" r="160" fill="none" stroke="currentColor" strokeWidth="1" />
                          <circle cx="320" cy="180" r="220" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                          {/* River Swilly */}
                          <path d="M-50,220 C200,240 400,195 850,230" fill="none" stroke="#2563eb" strokeWidth="24" strokeLinecap="round" className="opacity-40" />
                          
                          {/* Sideroads */}
                          <line x1="0" y1="120" x2="800" y2="120" stroke="currentColor" strokeWidth="3" />
                          <line x1="120" y1="0" x2="120" y2="800" stroke="currentColor" strokeWidth="3" />
                          <line x1="280" y1="0" x2="480" y2="800" stroke="currentColor" strokeWidth="4" />
                          <line x1="450" y1="100" x2="450" y2="350" stroke="currentColor" strokeWidth="3" />

                          {/* Green city park shapes */}
                          <rect x="50" y="20" width="80" height="60" rx="10" fill="currentColor" className="opacity-15" />
                          <rect x="420" y="280" width="120" height="90" rx="15" fill="currentColor" className="opacity-15" />
                        </svg>
                      </div>

                      {/* Map Location pinpoint graphic indicator */}
                      <div className="absolute left-[45%] top-[35%] flex flex-col items-center">
                        <span className="absolute animate-ping inline-flex h-10 w-10 rounded-full bg-cafe-forest opacity-35"></span>
                        <div className="relative z-10 w-12 h-12 rounded-full bg-cafe-forest flex items-center justify-center text-cafe-gold shadow-lg ring-4 ring-[#fbf9f6]">
                          <Coffee className="w-6 h-6 animate-bounce" />
                        </div>
                        <div className="mt-1 bg-cafe-forest/95 backdrop-blur-xs text-[#fbf9f6] text-[9px] font-mono px-2.5 py-0.5 rounded shadow-md font-bold tracking-widest min-w-max">
                          WILD ATLANTIC BEAN
                        </div>
                      </div>

                      {/* Local points of interest on letterkenny visual map */}
                      <span className="absolute left-[8%] top-[25%] text-[8px] tracking-wider font-mono text-cafe-charcoal/50 font-semibold bg-[#fbf9f6]/90 p-1.5 rounded border border-cafe-gold/10">St. Eunan's Cathedral</span>
                      <span className="absolute right-[12%] bottom-[25%] text-[8px] tracking-wider font-mono text-cafe-charcoal/50 font-semibold bg-[#fbf9f6]/90 p-1.5 rounded border border-cafe-gold/10">Main Car Park</span>
                      <span className="absolute right-[15%] top-[12%] text-[8px] tracking-wider font-mono text-cafe-charcoal/50 font-semibold bg-[#fbf9f6]/90 p-1.5 rounded border border-cafe-gold/10">An Grianán Theatre</span>

                      <div className="relative z-10 block mt-auto bg-[#fbf9f6]/95 backdrop-blur-md p-4 rounded-xl border border-cafe-gold/25 shadow-lg max-w-md text-left">
                        <h4 className="font-serif font-bold text-xs text-cafe-forest">Main Street Location Overview</h4>
                        <p className="text-[10px] text-cafe-charcoal/80 mt-1 leading-relaxed">
                          We sit exactly on Main Street Letterkenny (opposite Market Square). Surrounded by traditional storefronts and multiple public street parking grids (1 hr limits and full-day spaces).
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ----------------- GLOBAL FOOTER ----------------- */}
      <footer className="bg-cafe-charcoal text-[#fbf9f6] pt-16 pb-8 border-t border-cafe-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Footer columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-cafe-cream/10 pb-12">
            
            {/* Column 1 info and desc */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-[#fbf9f6]/10 flex items-center justify-center text-cafe-gold">
                  <Coffee className="w-5 h-5" />
                </div>
                <span className="font-serif text-lg font-bold tracking-tight text-[#fbf9f6]">
                  Wild Atlantic Bean
                </span>
              </div>
              <p className="text-xs text-cafe-cream/70 leading-relaxed font-light">
                Bringing the third-wave specialty craft coffee experience of the Wild Atlantic Way right home to Main Street, Letterkenny, County Donegal.
              </p>
              <div className="flex space-x-3 pt-2">
                <a href="https://instagram.com/wildatlanticbean" target="_blank" rel="noreferrer" className="text-cafe-cream/60 hover:text-cafe-gold transition-colors" aria-label="Footer Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-cafe-cream/60 hover:text-cafe-gold transition-colors" aria-label="Footer Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2 Navigation sitemap */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-cafe-gold uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                {[
                  { id: "home", label: "Home Base" },
                  { id: "menu", label: "Specialty Menu" },
                  { id: "about", label: "About Our Cafe" },
                  { id: "gallery", label: "Photo Chamber" },
                  { id: "contact", label: "Visit & Contact" }
                ].map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => setCurrentPage(l.id as any)}
                      className="text-cafe-cream/70 hover:text-cafe-gold hover:underline transition-colors block text-left cursor-pointer"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 Opening Hours */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-cafe-gold uppercase tracking-wider">Opening Hours</h4>
              <ul className="space-y-2 text-xs text-cafe-cream/70">
                <li className="flex justify-between">
                  <span>Mon – Fri</span>
                  <span className="font-semibold text-cafe-gold-light">8:00 AM – 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold text-cafe-gold-light">9:00 AM – 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-cafe-gold-light">10:00 AM – 5:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Column 4 Contact credentials info */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-cafe-gold uppercase tracking-wider">Contact Cards</h4>
              <ul className="space-y-2.5 text-xs text-cafe-cream/70">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cafe-gold shrink-0 mt-0.5" />
                  <span>Main Street, Letterkenny, Co. Donegal, F92 XY34</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cafe-gold shrink-0" />
                  <a href="tel:+353749123456" className="hover:text-cafe-gold hover:underline">+353 74 912 3456</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cafe-gold shrink-0" />
                  <a href="mailto:hello@wildatlanticbean.ie" className="hover:text-cafe-gold hover:underline">hello@wildatlanticbean.ie</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Subfoot proudly manufactured details */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-[11px] text-cafe-cream/40">
            <p>© 2026 Wild Atlantic Bean. All rights reserved.</p>
            <p className="flex items-center gap-1.5 mt-2 sm:mt-0 font-mono">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> in Letterkenny, Co. Donegal
            </p>
          </div>

        </div>
      </footer>

      {/* ----------------- PERSISTENT INTUITIVE GEMINI FLOATING CHATBOT WIDGET ----------------- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Chat Dialog box window Panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-cafe-gold/25 w-[330px] sm:w-[380px] h-[480px] sm:h-[520px] flex flex-col mb-4 bg-gradient-to-b from-[#fbf9f6] to-white"
              id="chatbot-expanded-window"
            >
              
              {/* Chat Title header bar */}
              <div className="bg-cafe-forest text-[#fbf9f6] p-4 flex items-center justify-between border-b border-cafe-gold/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-cafe-gold flex items-center justify-center text-cafe-forest relative">
                    <Coffee className="w-5 h-5 fill-cafe-forest" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-cafe-forest rounded-full"></span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-serif font-bold text-sm tracking-wide text-[#fbf9f6] flex items-center gap-1.5">
                      Chat with Bean-y <Sparkle className="w-3.5 h-3.5 text-cafe-gold fill-cafe-gold animate-pulse" />
                    </h4>
                    <span className="text-[9px] font-mono tracking-widest text-cafe-cream/70 uppercase">
                      Gemini-3.5-Flash Powered
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setChatOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#fbf9f6]/10 text-cafe-cream transition-colors cursor-pointer"
                  aria-label="Close Chat Window"
                  id="chatbot-close-button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat messaging bubbles window stream container */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-cafe-beige/25">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-cafe-forest text-[#fbf9f6] rounded-br-none shadow-xs"
                          : "bg-white text-cafe-charcoal rounded-bl-none border border-cafe-gold/15 shadow-2xs"
                      }`}
                    >
                      <p className="text-left whitespace-pre-wrap">{msg.text}</p>
                      <span
                        className={`block text-[9px] mt-1.5 text-right uppercase tracking-wider font-mono ${
                          msg.role === "user" ? "text-cafe-cream/60" : "text-cafe-charcoal/40"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Gemini Thinking/Typing Blinking Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-cafe-gold/15 px-4 py-3 rounded-2xl rounded-bl-none flex items-center space-x-1.5 h-9">
                      <span className="w-1.5 h-1.5 bg-cafe-forest rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-cafe-forest rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-cafe-forest rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input composition block */}
              <form 
                onSubmit={handleSendMessage} 
                className="p-3 border-t border-cafe-gold/15 bg-white flex items-center gap-2"
                id="chatbot-input-form"
              >
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about grinds, dietary menus, F92 XY34..."
                  className="flex-grow bg-cafe-beige/40 focus:bg-white border border-cafe-gold/20 focus:border-cafe-forest focus:ring-1 focus:ring-cafe-forest rounded-xl px-4 py-2.5 text-xs text-cafe-charcoal font-sans transition-colors outline-none"
                  id="chatbot-input-field"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-cafe-forest text-cafe-gold hover:bg-[#1a381c] hover:scale-103 shadow-md flex items-center justify-center shrink-0 transition-all cursor-pointer"
                  aria-label="Send Chatbot Message"
                  id="chatbot-send-button"
                >
                  <Send className="w-4 h-4 translate-x-[1px]" />
                </button>
              </form>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Circle Button Launcher */}
        <motion.button
          onClick={() => setChatOpen(!chatOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-cafe-forest hover:bg-[#1a381c] text-cafe-gold w-16 h-16 rounded-full shadow-2xl flex items-center justify-center relative cursor-pointer group hover:rotate-3 transition-transform"
          aria-label="Toggle Floating Assistant Widget"
          id="chatbot-launcher-btn"
        >
          {chatOpen ? (
            <X className="w-7 h-7 animate-spin-once" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cafe-gold rounded-full border border-cafe-forest animate-pulse"></span>
            </div>
          )}
        </motion.button>

      </div>

    </div>
  );
}
