import { Link } from 'react-router-dom';

export interface CourseCardProps {
  id?: string;
  to?: string;
  title: string;
  provider?: string;
  instructor?: string;
  badge?: string;
  rating?: number;
  students?: number;
  level?: string;
  duration?: string;
  price?: number;
  type?: string;
  gradient?: string;
  progress?: number;
  className?: string;
}

const CourseCard = ({
  to,
  title,
  provider,
  instructor,
  badge,
  rating,
  students,
  level,
  duration,
  price,
  type = 'Course',
  gradient = 'from-blue-50 to-purple-50',
  progress,
  className = '',
}: CourseCardProps) => {
  const content = (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
      <div
        className={`relative h-[160px] bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
      >
        <div className="text-4xl font-bold text-gray-400 group-hover:text-primary transition-colors">
          {title.charAt(0).toUpperCase()}
        </div>
        {badge && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-full text-xs font-medium text-primary shadow-sm">
            {badge}
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {type}
        </div>
      </div>

      {typeof progress === 'number' && (
        <div className="absolute left-0 right-0 bottom-0 p-4 pointer-events-none">
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        {provider && <div className="text-xs font-semibold text-[#0056d2] mb-1 truncate">{provider}</div>}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {title}
        </h3>
        {instructor && <p className="text-sm text-gray-600 mb-2">{instructor}</p>}

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-900">{(rating || 4).toFixed(1)}</span>
            <span className="text-yellow-400 text-sm">★</span>
          </div>
          <span className="text-xs text-gray-500">({students?.toLocaleString() || '0'})</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{students?.toLocaleString() || '0'} students</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {level && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">
              {level}
            </span>
          )}
          {duration && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
              {duration}
            </span>
          )}
          {price !== undefined && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
              {Math.round(price / 1000)}k VND
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={`block no-underline ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`block no-underline ${className}`}>{content}</div>;
};

export default CourseCard;

 