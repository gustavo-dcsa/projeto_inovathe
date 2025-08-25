import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  return (
    <section className="bg-bg-light py-20 md:py-32">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="text-center md:text-left animate-fade-up">
          <h1 className="font-extrabold text-4xl md:text-5xl leading-tight text-deep-teal">
            Human Collaboration, <br />
            <span className="text-primary">Organic Growth</span>.
          </h1>
          <p className="mt-6 text-lg text-neutral max-w-xl mx-auto md:mx-0">
            The Idea Bank is a space to cultivate innovation. Share your insights, collaborate on solutions, and watch great ideas grow into impactful realities.
          </p>
          <div className="mt-8">
            <Link to="/submit-idea">
              <Button size="lg" variant="primary" ariaLabel="Submit a new idea">
                Submit an Idea
              </Button>
            </Link>
          </div>
        </div>
        {/* Right Column: Illustration */}
        <div className="flex justify-center items-center animate-fade-up" style={{ animationDelay: '200ms' }}>
          {/* As per the brief, this will be replaced by a generated SVG */}
          <div className="w-full max-w-md h-80 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
            <p className="text-neutral text-sm">
              Illustration: "people assembling puzzle pieces and a flying lightbulb"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
