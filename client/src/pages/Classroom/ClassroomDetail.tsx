/**
 * Classroom Detail Page
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

// ... types
interface Comment {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  comments: Comment[];
}

interface Student {
    id: string;
    name: string;
    avatar: string;
    role: 'teacher' | 'student';
}

interface Document {
    id: string;
    title: string;
    type: string;
    url: string;
    date: string;
}

interface CourseInfo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    progress: number;
}

// ... mock data
const MOCK_MESSAGES: Message[] = [
  { 
    id: '1', 
    sender: 'John Doe', 
    avatar: 'J', 
    content: 'Welcome to the React Advanced Class! Check the syllabus for details.', 
    timestamp: '2 days ago',
    comments: [
        { id: 'c1', sender: 'Alice', avatar: 'A', content: 'Thank you!', timestamp: '2 days ago' },
        { id: 'c2', sender: 'Bob', avatar: 'B', content: 'Checked it.', timestamp: '1 day ago' }
    ]
  },
  { 
    id: '2', 
    sender: 'Alice', 
    avatar: 'A', 
    content: 'Thanks John! excited to learn.', 
    timestamp: '1 day ago',
    comments: [] 
  },
  { 
    id: '3', 
    sender: 'Bob', 
    avatar: 'B', 
    content: 'When is the first assignment due?', 
    timestamp: '5 hours ago',
    comments: [
        { id: 'c3', sender: 'John Doe', avatar: 'J', content: 'Next Friday.', timestamp: '1 hour ago' }
    ]
  },
];



const MOCK_STUDENTS: Student[] = [
    { id: '1', name: 'John Doe', avatar: 'J', role: 'teacher' },
    { id: '2', name: 'Alice', avatar: 'A', role: 'student' },
    { id: '3', name: 'Bob', avatar: 'B', role: 'student' },
    { id: '4', name: 'Charlie', avatar: 'C', role: 'student' },
    { id: '5', name: 'David', avatar: 'D', role: 'student' },
];

const MOCK_DOCUMENTS: Document[] = [
  { id: '1', title: 'Course Syllabus', type: 'pdf', url: '#', date: 'Aug 20' },
  { id: '2', title: 'React Hooks Deep Dive', type: 'video', url: '#', date: 'Aug 22' },
  { id: '3', title: 'State Management Patterns', type: 'doc', url: '#', date: 'Aug 25' },
  { id: '4', title: 'Advanced Props', type: 'link', url: '#', date: 'Aug 28' },
];

const MOCK_COURSE: CourseInfo = {
  id: 'c1',
  title: 'React Advanced: Enterprise Patterns',
  description: 'Master modern React with hooks, context, and performance optimization techniques.',
  thumbnail: '',
  progress: 35,
};

// ============================================================================
// Component
// ============================================================================

export const ClassroomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'stream' | 'materials' | 'people'>('stream');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: 'Me',
      avatar: 'M',
      content: newMessage,
      timestamp: 'Just now',
      comments: [],
    };
    setMessages([msg, ...messages]);
    setNewMessage('');
  };

  const handleAddComment = (messageId: string, content: string) => {
    if (!content.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      sender: 'Me',
      avatar: 'M',
      content: content,
      timestamp: 'Just now',
    };
    
    setMessages(messages.map(msg => {
        if (msg.id === messageId) {
            return { ...msg, comments: [...msg.comments, newComment] };
        }
        return msg;
    }));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'video': return 'VID';
      case 'link': return 'LINK';
      default: return 'DOC';
    }
  };

  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)] pb-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Banner */}
        <div className="w-full h-60 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-b-xl mb-6 relative p-8 flex flex-col justify-end shadow-md">
          <h1 className="text-4xl font-bold text-white mb-2">{MOCK_COURSE.title}</h1>
          <p className="text-blue-100 text-lg">Classroom • {MOCK_STUDENTS.filter(s => s.role === 'student').length} Learners</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button
            className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'stream'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('stream')}
          >
            Stream
          </button>
          <button
            className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'materials'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('materials')}
          >
            Materials
          </button>
          <button
            className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'people'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('people')}
          >
            People
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-[1fr_300px] gap-6 max-md:grid-cols-1">
          {/* Main Area */}
          <div className="min-w-0">
            {activeTab === 'stream' && (
              <div className="flex flex-col gap-6">
                {/* Input Box */}
                <Card className="shadow-sm border border-gray-200">
                   <div className="flex gap-4 items-start"> 
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">M</div>
                        <div className="flex-1">
                            <Input 
                                placeholder="Announce something to your class" 
                                className="w-full bg-gray-50 border-none focus:ring-0 mb-2"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                             {newMessage && (
                                <div className="flex justify-end pt-2">
                                    <Button size="sm" onClick={handleSendMessage}>Post</Button>
                                </div>
                             )}
                        </div>
                   </div>
                </Card>

                {/* Messages Stream */}
                {messages.map((msg) => (
                  <Card key={msg.id} className="shadow-sm border border-gray-200">
                    <div className="flex gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                        {msg.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{msg.sender}</span>
                          <span className="text-xs text-gray-500">{msg.timestamp}</span>
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="pl-14 border-t border-gray-100 pt-4">
                        {/* List Comments */}
                        {msg.comments.length > 0 && (
                            <div className="flex flex-col gap-3 mb-4">
                                {msg.comments.map(comment => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                                            {comment.avatar}
                                        </div>
                                        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                                            <div className="flex items-baseline gap-2 mb-0.5">
                                                 <span className="font-semibold text-sm text-gray-900">{comment.sender}</span>
                                                 <span className="text-[10px] text-gray-500">{comment.timestamp}</span>
                                            </div>
                                            <p className="text-gray-700 text-sm">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Add Comment Input */}
                        <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold shrink-0">M</div>
                            <div className="flex-1 relative">
                                <Input 
                                    placeholder="Add a class comment..." 
                                    className="w-full text-sm rounded-full py-2 px-4 bg-gray-50 border-gray-200 focus:bg-white transition-colors pr-10"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddComment(msg.id, e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'materials' && (
               <div className="flex flex-col gap-4">
                  {MOCK_DOCUMENTS.map((doc) => (
                    <Card key={doc.id} className="shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 text-2xl flex items-center justify-center">
                                {getFileIcon(doc.type)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-medium text-gray-900 mb-1">{doc.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="capitalize">{doc.type}</span>
                                    <span>•</span>
                                    <span>Posted {doc.date}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                  ))}
               </div>
            )}

            {activeTab === 'people' && (
              <Card className="shadow-sm border border-gray-200 min-h-[400px]">
                <h3 className="text-xl font-semibold text-primary mb-4 border-b border-gray-100 pb-2">Teachers</h3>
                {MOCK_STUDENTS.filter(s => s.role === 'teacher').map(student => (
                    <div key={student.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                         <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">{student.avatar}</div>
                         <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                ))}
                
                <h3 className="text-xl font-semibold text-primary mt-8 mb-4 border-b border-gray-100 pb-2 flex justify-between items-center">
                    <span>Classmates</span>
                    <span className="text-sm font-normal text-gray-500">{MOCK_STUDENTS.filter(s => s.role === 'student').length} students</span>
                </h3>
                 {MOCK_STUDENTS.filter(s => s.role === 'student').map(student => (
                    <div key={student.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">{student.avatar}</div>
                         <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                ))}
              </Card>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="max-md:hidden flex flex-col gap-6">
            {/* Associated Course */}
            <Card className="shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">About this Course</h4>
                <div className="mb-4">
                    <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                        Course Image
                    </div>
                    <h5 className="font-medium text-gray-800 text-sm mb-1">{MOCK_COURSE.title}</h5>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{MOCK_COURSE.description}</p>
                </div>
                 <Link to={`/course/${MOCK_COURSE.id}`}>
                    <Button variant="outline" size="sm" fullWidth>Go to Course</Button>
                 </Link>
            </Card>

            <Card className="shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                     <h4 className="font-semibold text-gray-700">Upcoming</h4>
                     <Link to="#" className="text-xs text-primary hover:underline">View all</Link>
                </div>
                <p className="text-sm text-gray-500">No work due soon</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
