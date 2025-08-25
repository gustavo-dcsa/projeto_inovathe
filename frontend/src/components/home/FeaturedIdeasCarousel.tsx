import React from 'react';
import { components } from '../../types/api-types';
import IdeaCard from '../ideas/IdeaCard';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';

// Extending the generated Idea type to include optional fields from the brief's example response.
type IdeaWithLikes = components['schemas']['Idea'] & {
  liked_by?: { id: number; avatar: string; }[];
  likes_count?: number;
};

interface FeaturedIdeasCarouselProps {
  ideas: IdeaWithLikes[];
  onLike: (ideaId: string) => void;
  likedIdeas: Set<string>; // A set of liked idea IDs for quick lookup
}

const FeaturedIdeasCarousel: React.FC<FeaturedIdeasCarouselProps> = ({ ideas, onLike, likedIdeas }) => {
  return (
    <section className="bg-bg-light py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-bold text-3xl text-deep-teal">Featured Ideas</h2>
          <p className="text-lg text-neutral mt-2">Check out some of the top-voted ideas from the community.</p>
        </div>
        <div className="flex overflow-x-auto space-x-8 pb-8 -mx-6 px-6 scrollbar-thin scrollbar-thumb-accent scrollbar-track-accent/20">
          {ideas.map((idea, index) => (
            <div key={idea.id} className="flex-shrink-0 w-80 animate-fade-up" style={{ animationDelay: `${index * 150}ms` }}>
              <IdeaCard
                idea={idea}
                onLike={onLike}
                isLiked={likedIdeas.has(idea.id)}
              />
            </div>
          ))}
          {/* A card to prompt users to see more */}
          <div className="flex-shrink-0 w-80 flex items-stretch animate-fade-up" style={{ animationDelay: `${ideas.length * 150}ms` }}>
             <Link to="/ideas" className="w-full h-full block">
                <Card hoverEffect={true} className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-5xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold text-primary">Explore All Ideas</h3>
                    <p className="text-neutral mt-2">See what else the community is thinking about.</p>
                    <div className="mt-4">
                        <Button variant="secondary">View More</Button>
                    </div>
                </Card>
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedIdeasCarousel;
