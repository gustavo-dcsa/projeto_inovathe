import React, { useState } from 'react';
import Hero from '../components/home/Hero';
import ThreeCardGrid from '../components/home/ThreeCardGrid';
import FeaturedIdeasCarousel from '../components/home/FeaturedIdeasCarousel';
import useIdeas from '../hooks/useIdeas';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  // Fetch featured ideas, ordered by the most recently created.
  const { data, isLoading, error } = useIdeas({ is_featured: true, ordering: '-created_at' });
  const { user } = useAuth();

  // State for optimistic updates and tracking likes
  const [likedIdeas, setLikedIdeas] = useState<Set<string>>(new Set());
  // State for the login required modal
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleLike = (ideaId: string) => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }

    // Optimistically update the UI
    const newLikedIdeas = new Set(likedIdeas);
    if (newLikedIdeas.has(ideaId)) {
      newLikedIdeas.delete(ideaId);
    } else {
      newLikedIdeas.add(ideaId);
    }
    setLikedIdeas(newLikedIdeas);

    // In a real app, you would call the API here to persist the like.
    // api.post(`/likes/`, { idea: ideaId }).catch(() => { /* revert optimistic update */ });
    console.log(`Toggling like for idea ${ideaId} for user ${user.pk}`);
  };

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  if (error || !data) {
    return <div className="text-center py-20 text-red-500">Failed to load featured ideas. Please try again later.</div>;
  }

  return (
    <div className="bg-bg-light">
      <Hero />
      <ThreeCardGrid />
      {data.results.length > 0 && (
          <FeaturedIdeasCarousel ideas={data.results} onLike={handleLike} likedIdeas={likedIdeas} />
      )}

      {/* CTA section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-bold text-3xl text-deep-teal">Ready to Make an Impact?</h2>
          <p className="text-lg text-neutral mt-2 max-w-2xl mx-auto">Your next idea could be the one that changes everything. Don't hesitate to share it with the community.</p>
          <div className="mt-8">
            <Link to="/submit-idea">
              <Button size="lg" variant="primary" className="animate-pulse-cta">
                Submit Your Idea Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} title="Authentication Required">
        <p className="text-neutral">You must be logged in to like an idea.</p>
        <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setLoginModalOpen(false)}>Cancel</Button>
            <Link to="/login">
                <Button variant="primary">Log In</Button>
            </Link>
        </div>
      </Modal>
    </div>
  );
};

// A skeleton loader for the home page for a better UX
const HomePageSkeleton: React.FC = () => (
  <div className="animate-pulse">
    {/* Hero Skeleton */}
    <div className="bg-gray-200/50 py-32">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="h-10 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 rounded w-full"></div>
          <div className="h-6 bg-gray-300 rounded w-5/6"></div>
          <div className="h-14 bg-gray-400 rounded-lg w-48 mt-4"></div>
        </div>
        <div className="h-96 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
     {/* Carousel Skeleton */}
    <div className="py-20 bg-bg-light">
        <div className="container mx-auto px-6">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-12"></div>
            <div className="flex space-x-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-80 h-72 bg-white rounded-lg shadow-md flex-shrink-0 p-6 space-y-4">
                       <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                       <div className="h-4 bg-gray-300 rounded w-full"></div>
                       <div className="h-4 bg-gray-300 rounded w-full"></div>
                       <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                       <div className="pt-10 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-300 -ml-2"></div>
                          </div>
                          <div className="h-8 w-20 bg-gray-300 rounded"></div>
                       </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  </div>
);

export default HomePage;
