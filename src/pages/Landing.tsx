import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BackgroundImage from '@/components/BackgroundImage';
import { Zap, Camera, MessageCircle, Video, Trophy, Leaf, ClipboardCheck, Upload, Info, Award } from 'lucide-react';
import GifPlaceholder from '@/components/placeholders/GifPlaceholder';
import { LucideIcon } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { motion } from 'framer-motion';
import ChatAssistant from '@/components/assistant/ChatAssistant';
import { useEffect } from 'react';

const FeatureCard = ({ icon: Icon, title, children, index }: { icon: LucideIcon; title: string; children: string; index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
    className="flex flex-col items-center text-center p-8 bg-[#F3FFF3] rounded-xl border border-muted/30 shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
  >
    <div className="mb-6 p-4 rounded-lg bg-eco-green/10 text-eco-green">
      <Icon className="h-10 w-10" />
    </div>
    <h3 className="font-semibold mb-3 text-xl">{title}</h3>
    <p className="text-muted-foreground leading-relaxed max-w-xs">{children}</p>
  </motion.div>
);

const Landing = () => {
  
  // Add styles for section highlighting
  useEffect(() => {
    // Add CSS for advanced animation effects
    const style = document.createElement('style');
    style.textContent = `
      /* Navigation click effect */
      .nav-click-effect {
        animation: nav-pop 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        transform-origin: center;
      }
      
      @keyframes nav-pop {
        0% { transform: scale(1); color: var(--eco-green); }
        40% { transform: scale(1.4); color: var(--eco-green); }
        60% { transform: scale(0.9); }
        80% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      /* Ripple effect */
      .nav-ripple {
        position: fixed;
        transform: translate(-50%, -50%);
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: rgba(74, 222, 128, 0.3);
        pointer-events: none;
        z-index: 1000;
        animation: ripple-effect 1s cubic-bezier(0, 0.5, 0.5, 1) forwards;
      }
      
      @keyframes ripple-effect {
        0% { width: 5px; height: 5px; opacity: 1; }
        100% { width: 500vw; height: 500vw; opacity: 0; }
      }
      
      /* Section reveal effect */
      .section-reveal-effect {
        animation: section-reveal 1.2s ease-out;
      }
      
      @keyframes section-reveal {
        0% { opacity: 0.5; transform: scale(0.97); }
        70% { opacity: 1; transform: scale(1.02); }
        100% { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Simplified smooth-scroll behavior (slower, no fancy effects)
  useEffect(() => {
    const handleNavClick = (e: Event) => {
      e.preventDefault();

      const anchor = e.currentTarget as HTMLAnchorElement;
      const id = anchor.getAttribute('href')?.substring(1);
      if (!id) return;

      const element = document.getElementById(id);
      if (!element) return;

      const yOffset = -80; // Offset for fixed header
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800; // slower smooth scroll

      let start: number | null = null;
      const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

      const step = (timestamp: number) => {
        if (start === null) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutQuad(progress);
        window.scrollTo(0, startPosition + distance * ease);
        if (progress < 1) window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
    };

    // Attach to all in-page anchors, including the “See How It Works” button wrapper
    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchors.forEach(a => a.addEventListener('click', handleNavClick));

    return () => anchors.forEach(a => a.removeEventListener('click', handleNavClick));
  }, []);

  return (
  <BackgroundImage>
    {/* Chat Assistant - only on landing page */}
    <ChatAssistant />
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      {/* Central card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8 md:p-16 relative">

        {/* Top nav */}
        <motion.nav 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-20">
          {/* Logo + wordmark */}
          <Link to="/" className="flex items-center gap-3">
            <ImageWithFallback 
              src="/newLogo.png" 
              alt="Releaf logo" 
              className="h-10 w-10" 
              fallbackSrc="/placeholder.svg"
            />
            <span className="font-extrabold text-2xl text-eco-green tracking-wide">RELEAF</span>
          </Link>
          <ul className="hidden md:flex justify-center items-center space-x-6 text-base font-medium text-eco-green">
            <li className="flex items-center justify-center">
              <a 
                href="#features" 
                className="relative text-center px-2 py-2 overflow-hidden group hover:text-eco-green transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
                Features
              </a>
            </li>
            <li className="flex items-center justify-center">
              <a 
                href="#how-it-works" 
                className="relative text-center px-2 py-2 overflow-hidden group hover:text-eco-green transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
                How It Works
              </a>
            </li>
            <li className="flex items-center justify-center">
              <a 
                href="#impact" 
                className="relative text-center px-2 py-2 overflow-hidden group hover:text-eco-green transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
                Impact
              </a>
            </li>
            <li className="flex items-center justify-center">
              <a 
                href="#team" 
                className="relative text-center px-2 py-2 overflow-hidden group hover:text-eco-green transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
                About the Team
              </a>
            </li>
            <li className="flex items-center justify-center">
              <a 
                href="#faq" 
                className="relative text-center px-2 py-2 overflow-hidden group hover:text-eco-green transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
                FAQ
              </a>
            </li>
          </ul>
          <Link to="/login">
            <Button className="px-8 py-6 text-base rounded-xl transition-all hover:scale-105">Get Started</Button>
          </Link>
        </motion.nav>

        {/* Hero */}
        <section className="text-center mb-28" id="hero">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight"
          >
            Snap · Sort · Save the Planet
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground text-xl mb-12">
            AI-powered recycling guidance. <span className="font-semibold">100% free.</span>
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center mb-10">
            <Link to="/login">
              <Button className="px-10 py-7 text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
                Get Started
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" className="px-10 py-7 text-lg rounded-xl transition-all duration-300 hover:bg-green-50 hover:border-eco-green">
                See How It Works
              </Button>
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-8">
            <Zap className="h-4 w-4" /> Powered by <span className="font-semibold ml-1">Google Gemini Flash 2.0</span>
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="mb-28 scroll-mt-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12">
            Features
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard index={0} icon={Camera} title="Snap & Sort AI">Instantly identify recyclables with a photo.</FeatureCard>
            <FeatureCard index={1} icon={MessageCircle} title="Describe an Item">Get an answer by typing in a description.</FeatureCard>
            <FeatureCard index={2} icon={Video} title="Verify Disposal">Check if you're using the right-bin video.</FeatureCard>
            <FeatureCard index={3} icon={Trophy} title="Gamified Habits">Boost your recycling with fun challenges.</FeatureCard>
          </div>
        </section>

        {/* Proof / Impact */}
        <section id="impact" className="mb-28 scroll-mt-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12">
            Why Releaf
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center p-8 bg-gradient-to-r from-eco-green/10 to-eco-green/5 rounded-2xl shadow-md h-full">
              <Leaf className="h-16 w-16 text-eco-green mr-6" />
              <div>
                <h3 className="font-bold text-xl mb-2">Advanced AI Technology</h3>
                <p className="font-medium text-lg">Powered by Google Gemini Flash 2.0</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border rounded-2xl p-8 flex flex-col justify-between shadow-md">
              <div className="mb-8">
                <p className="text-5xl font-bold text-eco-green mb-2">25%</p>
                <p className="text-base text-muted-foreground">The average recycling contamination rate.</p>
              </div>
              <div className="mb-8">
                <p className="text-5xl font-bold text-eco-green mb-2">27M</p>
                <p className="text-base text-muted-foreground">Tons of plastic landfilled in 2018 (EPA).</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-eco-green mb-2">50%</p>
                <p className="text-base text-muted-foreground">With this website we could get an increase of 50% in half a year.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mb-28 scroll-mt-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12">
            How It Works
          </motion.h2>
          
          <div className="flex flex-col items-center space-y-8">
            {[
              { step: 1, title: "Upload an Image", description: "Take a photo of any item you're unsure how to recycle" },
              { step: 2, title: "Get AI Analysis", description: "Our AI instantly determines if and how the item can be recycled" },
              { step: 3, title: "Track Your Impact", description: "Build streaks and see your positive environmental contribution" }
            ].map((item, index) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex w-full max-w-2xl items-start p-6 bg-white rounded-xl shadow-md"
              >
                <div className="bg-eco-green text-white rounded-full w-12 h-12 flex items-center justify-center mr-6 shrink-0">
                  <span className="font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  {item.step === 1 && (
                    <GifPlaceholder 
                      icon={ClipboardCheck} 
                      title="Upload items to recycle properly"
                      gifSrc="/clip1.svg"
                    >
                      Scan questionable items for proper recycling guidance
                    </GifPlaceholder>
                  )}
                  {item.step === 2 && (
                    <GifPlaceholder 
                      icon={Camera} 
                      title="AI analyzes your items in real-time"
                      gifSrc="/clip2.svg"
                    >
                      Watch as our AI determines recyclability and materials
                    </GifPlaceholder>
                  )}
                  {item.step === 3 && (
                    <GifPlaceholder 
                      icon={Info} 
                      title="Track your environmental impact"
                      gifSrc="/clip3.svg"
                    >
                      View your history and build streaks to save the planet
                    </GifPlaceholder>
                  )}
                  {item.step === 4 && (
                    <GifPlaceholder 
                      icon={Award} 
                      title="Build streaks and compete"
                    >
                      Track your progress and climb the leaderboard
                    </GifPlaceholder>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Team Section */}
        <section id="team" className="mb-28 scroll-mt-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12">
            Meet the Releaf Team
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Sean E.', role: 'Frontend Developer', photo: '/teamphotos/sean.svg', bio: 'Creates beautiful, responsive interfaces that bring the Releaf experience to life.' },
              { name: 'Kevin H.', role: 'Backend Developer', photo: '/teamphotos/kevin.svg', bio: 'Architect of Releaf\'s server infrastructure and data pipelines.' },
              { name: 'Enzo P.', role: 'Graphic Designer', photo: '/teamphotos/enzo.svg', bio: 'Crafts the visual identity of Releaf with an eye for sustainability-inspired aesthetics.' },
              { name: 'Turat Z.', role: 'Creative Director', photo: '/teamphotos/turat.svg', bio: 'Guides the vision and storytelling behind Releaf.' }
            ].map((member, index) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center p-6 border rounded-xl shadow-sm bg-[#F8FFF8]">
                <ImageWithFallback 
                  src={member.photo} 
                  alt={member.name} 
                  className="h-24 w-24 mx-auto mb-4 rounded-full object-cover" 
                  fallbackSrc="/placeholder.svg"
                />
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-28 scroll-mt-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { q: "Is Releaf really 100% free?", a: "Yes! We believe everyone should have access to recycling guidance." },
              { q: "How accurate is the AI?", a: "Our Gemini-powered AI has been trained on thousands of items with 90%+ accuracy." },
              { q: "Can I use Releaf on my phone?", a: "Absolutely! Releaf is a web platform that works perfectly on mobile devices." },
              { q: "Do I need to create an account?", a: "An account lets you track progress, but you can also use basic features without one." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="p-6 bg-[#F3FFF3] rounded-xl border border-muted/30"
              >
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Footer mini-nav */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="border-t pt-8 mt-8 text-center text-base text-eco-green"
        >
          <div className="flex flex-wrap justify-center gap-8 mb-4">
            <a href="#features" className="relative px-2 py-1 overflow-hidden group hover:text-eco-green transition-all duration-300">
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
              Features
            </a>
            <a href="#how-it-works" className="relative px-2 py-1 overflow-hidden group hover:text-eco-green transition-all duration-300">
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
              How It Works
            </a>
            <a href="#impact" className="relative px-2 py-1 overflow-hidden group hover:text-eco-green transition-all duration-300">
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
              Impact
            </a>
            <a href="#team" className="relative px-2 py-1 overflow-hidden group hover:text-eco-green transition-all duration-300">
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
              About the Team
            </a>
            <a href="#faq" className="relative px-2 py-1 overflow-hidden group hover:text-eco-green transition-all duration-300">
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
              FAQ
            </a>
          </div>
          
          <div className="text-sm text-muted-foreground mt-4">
            &copy; {new Date().getFullYear()} Releaf. All rights reserved.
          </div>
        </motion.footer>
      </motion.div>
    </div>
  </BackgroundImage>
  );
};

export default Landing;
