import BackgroundImage from '@/components/BackgroundImage';

const team = [
  { name: 'Sean E.', role: 'Full-Stack Developer', bio: 'Passionate about building sustainable technology.' },
  { name: 'Alex K.', role: 'AI Engineer', bio: 'Loves fine-tuning models for real-world impact.' },
  { name: 'Taylor S.', role: 'Product Designer', bio: 'Designs intuitive experiences with an eco flair.' },
];

const About = () => (
  <BackgroundImage>
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-8 text-center text-eco-green">Meet the Team</h1>
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
