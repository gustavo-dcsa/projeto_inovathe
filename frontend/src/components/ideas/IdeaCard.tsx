import React from 'react';
import { components } from '../../types/api-types';
import Card from '../ui/Card';
import Button from '../ui/Button';

// The brief specifies a shape for the `liked_by` array.
// Let's create a type for it for clarity.
interface Liker {
  id: number;
  avatar: string; // URL to an avatar image
}

// We extend the generated Idea type to include the optional fields from the brief's example response.
type IdeaWithLikes = components['schemas']['Idea'] & {
  liked_by?: Liker[];
  likes_count?: number;
};

type IdeaCardProps = {
  idea: IdeaWithLikes;
  onLike: (ideaId: string) => void;
  isLiked: boolean;
};

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onLike, isLiked }) => {
  // Use optional chaining and default values for safety.
  const { id, title, description, liked_by = [], likes_count = 0 } = idea;

  const maxAvatars = 3; // Max avatars to show before showing the overflow count
  const displayedAvatars = liked_by.slice(0, maxAvatars);
  const overflowCount = Math.max(0, likes_count - displayedAvatars.length);

  return (
    <Card hoverEffect={true} className="flex flex-col h-full justify-between">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-deep-teal mb-2 line-clamp-2">{title}</h3>
        <p className="text-neutral text-base line-clamp-3">
          {description}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center flex-shrink-0">
          <div className="flex -space-x-2">
            {displayedAvatars.map((liker) => (
              <img
                key={liker.id}
                src={liker.avatar || `https://i.pravatar.cc/40?u=${liker.id}`} // Fallback avatar
                alt={`User ${liker.id}`}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
          </div>
          {overflowCount > 0 && (
            <div className="text-sm text-neutral ml-2">
              + {overflowCount} more
            </div>
          )}
        </div>
        <Button
          variant={isLiked ? 'primary' : 'ghost'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click if any
            onLike(id);
          }}
          aria-pressed={isLiked}
        >
          {isLiked ? 'Liked' : 'Like'}
        </Button>
      </div>
    </Card>
  );
};

export default IdeaCard;
