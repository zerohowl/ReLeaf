import BackgroundImage from '@/components/BackgroundImage';

const team = [
  { name: 'Sean E.', role: 'Frontend Developer', bio: 'Creates beautiful, responsive interfaces that bring the Releaf experience to life. Passionate about creating intuitive user experiences with modern web technologies.' },
  { name: 'Kevin H.', role: 'Backend Developer', bio: 'Architect of Releaf\'s server infrastructure and data pipelines. Specializes in building robust, scalable systems that power our AI-driven recycling platform.' },
  { name: 'Enzo P.', role: 'Graphic Designer', bio: 'Crafts the visual identity of Releaf with an eye for sustainability-inspired aesthetics. Transforms complex environmental concepts into clear, compelling visuals.' },
  { name: 'Turat Z.', role: 'Creative Director', bio: 'Guides the vision and storytelling behind Releaf. Blends environmental passion with innovative thinking to shape our brand\'s unique voice and mission.' },
];

const About = () => (
  <BackgroundImage>
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-8 text-center text-eco-green">Meet the Releaf Team</h1>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center p-4 border rounded-xl shadow-sm bg-[#F8FFF8]">
              <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-eco-green/10 flex items-center justify-center text-eco-green font-bold">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h3 className="font-semibold mb-1">{member.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </BackgroundImage>
);

export default About;
