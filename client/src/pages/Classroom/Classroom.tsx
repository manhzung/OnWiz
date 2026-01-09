/**
 * Classroom List Page
 */

import ClassroomCard from '../../components/common/ClassroomCard';
import { Button } from '../../components/common/Button';
import { useSearch } from '../../contexts/SearchContext';
import { ROUTES } from '../../config/routes';

// ============================================================================
// Types
// ============================================================================

interface Classroom {
  id: string;
  name: string;
  instructor: string;
  topic: string;
  membersCount: number;
  description: string;
  isEnrolled: boolean;
  provider?: string;
  students?: number;
}

// ============================================================================
// Component
// ============================================================================

export const Classroom = () => {
  const { searchTerm } = useSearch();

  // Mock Data
  const classrooms: Classroom[] = [
    {
      id: '1',
      name: 'React Advanced Class',
      instructor: 'John Doe',
      topic: 'Frontend Development',
      membersCount: 45,
      students: 45,
      provider: 'Meta',
      description: 'Advanced concepts of React including Hooks, Context, and Performance.',
      isEnrolled: true,
    },
    {
      id: '2',
      name: 'UI/UX Design Workshop',
      instructor: 'Jane Smith',
      topic: 'Design',
      membersCount: 32,
      students: 32,
      provider: 'Google',
      description: 'Hands-on workshop for creating beautiful user interfaces.',
      isEnrolled: true,
    },
    {
      id: '3',
      name: 'Node.js Backend Master',
      instructor: 'Mike Johnson',
      topic: 'Backend Development',
      membersCount: 28,
      students: 28,
      provider: 'IBM',
      description: 'Master Node.js, Express, and MongoDB.',
      isEnrolled: false,
    },
  ];

  const filteredClassrooms = classrooms.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-8xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classrooms</h1>
            <p className="text-gray-600">Manage and participate in your enrolled classes</p>
          </div>
          <Button variant="primary">Join Class</Button>
        </div>



        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
          {filteredClassrooms.map((classroom) => (
            <div key={classroom.id}>
              <ClassroomCard
                to={ROUTES.CLASSROOM_DETAIL.replace(':id', classroom.id)}
                title={classroom.name}
                topic={classroom.topic}
                description={classroom.description}
                instructor={classroom.instructor}
                membersCount={classroom.membersCount}
                isEnrolled={classroom.isEnrolled}
                variant="compact"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
