import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BackgroundImage from '@/components/BackgroundImage';
import { Zap, Camera, MessageCircle, Video, Trophy, Leaf } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
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
    // Add CSS for highlighted sections
    const style = document.createElement('style');
    style.textContent = `
      .highlight-section {
        animation: highlight-pulse 1.5s ease-in-out;
      }
      
      @keyframes highlight-pulse {
        0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        50% { box-shadow: 0 0 20px 10px rgba(74, 222, 128, 0.3); }
        100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add smooth scroll behavior with animation
  useEffect(() => {
    // Set up enhanced scrolling behavior
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id as string);
        
        if (element) {
          // Highlight the section visually
          element.classList.add('highlight-section');
          
          // Scroll with a custom animation
          const yOffset = -80; // Offset for fixed headers
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
          
          // Remove highlight after animation completes
          setTimeout(() => {
            element.classList.remove('highlight-section');
          }, 1500);
        }
      }
    };
    
    // Add event listeners to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleNavClick as EventListener);
    });
    
    // Clean up event listeners
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleNavClick as EventListener);
      });
    };
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
            <img src="/newLogo.png" alt="Releaf logo" className="h-10 w-10" />
            <span className="font-extrabold text-2xl text-eco-green tracking-wide">RELEAF</span>
          </Link>
          <ul className="hidden md:flex gap-8 text-base font-medium text-eco-green">
            <li>
              <a 
                href="#features" 
                className="relative px-2 py-1 overflow-hidden group hover:text-eco-green transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
                Features
              </a>
            </li>
            <li>
              <a 
                href="#how-it-works" 
                className="relative px-2 py-1 overflow-hidden group hover:text-eco-green transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
                How It Works
              </a>
            </li>
            <li>
              <a 
                href="#impact" 
                className="relative px-2 py-1 overflow-hidden group hover:text-eco-green transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
                Impact
              </a>
            </li>
            <li>
              <a 
                href="#team" 
                className="relative px-2 py-1 overflow-hidden group hover:text-eco-green transition-all duration-300"
              >
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-eco-green group-hover:w-full transition-all duration-300"></span>
                About the Team
              </a>
            </li>
            <li>
              <a 
                href="#faq" 
                className="relative px-2 py-1 overflow-hidden group hover:text-eco-green transition-all duration-300"
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
              <Button className="px-10 py-7 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Get Started
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" className="px-10 py-7 text-lg rounded-xl transition-all hover:scale-105">
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
                <p className="text-5xl font-bold text-eco-green mb-2">17%</p>
                <p className="text-base text-muted-foreground">Average contamination level in recycling.</p>
              </div>
              <div className="mb-8">
                <p className="text-5xl font-bold text-eco-green mb-2">20M</p>
                <p className="text-base text-muted-foreground">Recyclable items sent to landfills per year.</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-eco-green mb-2">Up to 90%</p>
                <p className="text-base text-muted-foreground">Reduction in contamination with real-time info.</p>
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
                  <p className="text-muted-foreground">{item.description}</p>
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
              { name: 'Sean E.', role: 'Frontend Developer', bio: 'Creates beautiful, responsive interfaces that bring the Releaf experience to life.' },
              { name: 'Kevin H.', role: 'Backend Developer', bio: 'Architect of Releaf\'s server infrastructure and data pipelines.' },
              { name: 'Enzo P.', role: 'Graphic Designer', bio: 'Crafts the visual identity of Releaf with an eye for sustainability-inspired aesthetics.' },
              { name: 'Turat Z.', role: 'Creative Director', bio: 'Guides the vision and storytelling behind Releaf.' }
            ].map((member, index) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center p-6 border rounded-xl shadow-sm bg-[#F8FFF8]">
                <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-eco-green/10 flex items-center justify-center text-eco-green font-bold">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
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
            © {new Date().getFullYear()} Releaf. All rights reserved.
          </div>
        </motion.footer>
      </motion.div>
    </div>
  </BackgroundImage>
  );
};

export default Landing;
