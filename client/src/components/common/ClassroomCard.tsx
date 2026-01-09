import { Link } from 'react-router-dom';

export interface ClassroomCardProps {
  to?: string;
  title: string;
  topic?: string;
  description?: string;
  instructor?: string;
  membersCount?: number;
  isEnrolled?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

const ClassroomCard = ({
  to,
  title,
  topic,
  description,
  instructor,
  membersCount,
  isEnrolled = false,
  variant = 'default',
  className = '',
}: ClassroomCardProps) => {
  const defaultContent = (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="relative h-[160px] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <div className="text-4xl font-bold text-gray-400 group-hover:text-primary transition-colors">
          {title.charAt(0)}
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          Classroom
        </div>
        {isEnrolled && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Enrolled
          </div>
        )}
      </div>

      <div className="p-4">
        {topic && <div className="text-xs font-semibold text-[#0056d2] mb-1 truncate">{topic}</div>}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{title}</h3>
        {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
            {instructor?.charAt(0) || 'A'}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{instructor}</div>
          </div>
        </div>

        <div className="flex items-center">
          <span className="ml-auto text-xs text-gray-500">{membersCount || 0} students</span>
        </div>
      </div>
    </div>
  );

  const compactContent = (
    <div className={`bg-white rounded-md overflow-hidden p-3 border border-gray-200 flex items-start gap-4 ${className}`}>
      <div className="w-12 h-12 rounded-md flex items-center justify-center bg-gradient-to-br from-primary to-primary-hover text-white font-semibold text-lg flex-shrink-0">
        {title.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{title}</div>
            {topic && <div className="text-xs text-gray-500 truncate">{topic}</div>}
          </div>
          <div className="text-xs text-gray-400">⋯</div>
        </div>

        {description && <p className="text-xs text-gray-600 mt-2 line-clamp-2">{description}</p>}

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18"/></svg>
            <span className="text-gray-600">Resources</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v7"/></svg>
            <span className="text-gray-600">{membersCount || 0}</span>
          </div>
          <div className="ml-auto text-xs text-gray-500">{isEnrolled ? 'Enrolled' : ''}</div>
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block no-underline">
        {variant === 'compact' ? compactContent : defaultContent}
      </Link>
    );
  }

  return variant === 'compact' ? compactContent : defaultContent;
};

export default ClassroomCard;


