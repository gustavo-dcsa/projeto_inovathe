export interface Idea {
  id: string;
  title: string;
  description: string;
  submitted_by_email: string;
  full_name: string;
  submission_type: string;
  team_members?: string;
  business_unit: string;
  department?: string;
  position?: string;
  idea_category: string;
  expected_benefits: string;
  required_resources: string;
  estimated_impact: string;
  implementation_timeline: string;
  inspiration?: string;
  additional_comments?: string;
  status: string;
  stage: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  likes_count: number;
  // Add any other fields that come from the API
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
