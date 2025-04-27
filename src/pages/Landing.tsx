import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BackgroundImage from '@/components/BackgroundImage';
import { Zap, Camera, MessageCircle, Video, Trophy, Leaf } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: string }) => (
  <div className="flex flex-col items-center text-center p-6 bg-[#F3FFF3] rounded-xl border border-muted/30 shadow-sm">
    <div className="mb-4 p-3 rounded-lg bg-eco-green/10 text-eco-green">
      <Icon className="h-8 w-8" />
    </div>
    <h3 className="font-semibold mb-2 text-lg">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{children}</p>
  </div>
);

const Landing = () => (
  <BackgroundImage>
    <div className="min-h-screen flex flex-col items-center py-6 px-4">
      {/* Central card */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8 md:p-12 relative">
        {/* Top nav */}
        <nav className="flex items-center justify-between mb-10">
          {/* Logo + wordmark */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/newLogo.png" alt="Re-Leaf logo" className="h-8 w-8" />
            <span className="font-extrabold text-xl text-eco-green tracking-wide">RE-LEAF</span>
          </Link>
          <ul className="hidden md:flex gap-6 text-sm font-medium text-eco-green">
            <li><a href="#features" className="hover:text-eco-green/80">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-eco-green/80">How It Works</a></li>
            <li><a href="#impact" className="hover:text-eco-green/80">Impact</a></li>
            <li><Link to="/about" className="hover:text-eco-green/80">About the Team</Link></li>
            <li><a href="#faq" className="hover:text-eco-green/80">FAQ</a></li>
          </ul>
          <Link to="/login">
            <Button className="px-6">Get Started</Button>
          </Link>
        </nav>

        {/* Hero */}
        <section className="text-center mb-16" id="hero">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Snap · Sort · Save the Planet</h1>
          <p className="text-muted-foreground text-lg mb-8">AI-powered recycling guidance. <span className="font-semibold">100% free.</span></p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/login"><Button className="px-8 py-6">Get Started</Button></Link>
            <a href="#how-it-works"><Button variant="outline" className="px-8 py-6">See How It Works</Button></a>
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Zap className="h-3 w-3" /> Powered by <span className="font-semibold ml-1">Google Gemini Flash 2.0</span>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={Camera} title="Snap & Sort AI">Instantly identify recyclables with a photo.</FeatureCard>
            <FeatureCard icon={MessageCircle} title="Describe an Item">Get an answer by typing in a description.</FeatureCard>
            <FeatureCard icon={Video} title="Verify Disposal">Check if you’re using the right-bin video.</FeatureCard>
            <FeatureCard icon={Trophy} title="Gamified Habits">Boost your recycling with fun challenges.</FeatureCard>
          </div>
        </section>

        {/* Proof / Impact */}
        <section id="impact" className="mb-16 grid md:grid-cols-2 gap-8">
          <div className="flex items-center p-6 bg-gradient-to-r from-eco-green/10 to-eco-green/5 rounded-xl">
            <Leaf className="h-10 w-10 text-eco-green mr-4" />
            <p className="font-semibold">Powered by Google Gemini Flash 2.0</p>
          </div>
          <div className="bg-white border rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div className="mb-4">
              <p className="text-4xl font-bold text-eco-green">17%</p>
              <p className="text-sm text-muted-foreground">Average contamination level in recycling.</p>
            </div>
            <div className="mb-4">
              <p className="text-4xl font-bold text-eco-green">20M</p>
              <p className="text-sm text-muted-foreground">Recyclable items sent to landfills per year.</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-eco-green">Up to 90%</p>
              <p className="text-sm text-muted-foreground">Reduction in contamination with real-time info.</p>
            </div>
          </div>
        </section>

        {/* Footer mini-nav */}
        <footer className="border-t pt-4 text-center text-sm text-eco-green">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#features" className="hover:text-eco-green/80">Features</a>
            <a href="#how-it-works" className="hover:text-eco-green/80">How It Works</a>
            <a href="#impact" className="hover:text-eco-green/80">Impact</a>
            <Link to="/about" className="hover:text-eco-green/80">About the Team</Link>
            <a href="#faq" className="hover:text-eco-green/80">FAQ</a>
          </div>
        </footer>
      </div>
    </div>
  </BackgroundImage>
);

export default Landing;
