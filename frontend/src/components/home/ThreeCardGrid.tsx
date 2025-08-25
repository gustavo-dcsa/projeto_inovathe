import React from 'react';
import Card from '../ui/Card';

// In a real app, this data might come from a CMS or a static config file.
const features = [
  {
    title: 'Submit & Refine',
    description: 'Have a brilliant idea? Document it, get feedback, and refine your concept with the help of the community.',
    icon: '💡', // Placeholder for a real icon component
  },
  {
    title: 'Collaborate & Build',
    description: 'Connect with colleagues from different departments to build on ideas and turn them into concrete projects.',
    icon: '🤝', // Placeholder
  },
  {
    title: 'Track & Celebrate',
    description: 'Follow the journey of your ideas from submission to implementation and celebrate the collective success.',
    icon: '🏆', // Placeholder
  },
];

const ThreeCardGrid: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-bold text-3xl text-deep-teal">A Hub for Innovation</h2>
          <p className="text-lg text-neutral mt-2">Everything you need to bring ideas to life.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 150}ms` }}>
              <Card className="text-center h-full">
                <div className="text-5xl mb-4" role="img" aria-label={feature.title}>{feature.icon}</div>
                <h3 className="text-xl font-bold text-deep-teal mb-2">{feature.title}</h3>
                <p className="text-neutral">{feature.description}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeCardGrid;
