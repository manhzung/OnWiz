const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Category = require('./src/models/category.model').Category;
const Course = require('./src/models/course.model');
const Enrollment = require('./src/models/enrollment.model').Enrollment;
const Transaction = require('./src/models/transaction.model').Transaction;
const Order = require('./src/models/order.model').Order;
const Module = require('./src/models/module.model');
const { Lesson } = require('./src/models/lesson.model');
const { LessonVideo } = require('./src/models/lessonVideo.model');
const LessonTheory = require('./src/models/lessonTheory.model');
const LessonQuiz = require('./src/models/lessonQuiz.model');
const { Question } = require('./src/models/question.model');
const QuestionSingleChoice = require('./src/models/questionSingleChoice.model');
const QuestionMultipleChoice = require('./src/models/questionMultipleChoice.model');
const QuestionFillIn = require('./src/models/questionFillIn.model');
const Attempt = require('./src/models/attempt.model');
const Classroom = require('./src/models/classroom.model').Classroom;
const Message = require('./src/models/message.model').Message;
const Notification = require('./src/models/notification.model').Notification;

// Mock data for seeding
const PROVIDERS = [
  { id: 'google', name: 'Google', logo: 'G' },
  { id: 'meta', name: 'Meta', logo: '∞' },
  { id: 'microsoft', name: 'Microsoft', logo: 'M' },
  { id: 'amazon', name: 'Amazon', logo: 'A' },
  { id: 'coursera', name: 'Coursera', logo: 'C' },
];

const INSTRUCTORS = [
  'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson',
  'David Brown', 'Emma Davis', 'Chris Wilson', 'Lisa Garcia'
];

const COURSE_TITLES = [
  'Complete Web Development Bootcamp',
  'React from Basics to Advanced',
  'Python for Beginners',
  'Data Science Fundamentals',
  'Advanced JavaScript Concepts',
  'UI/UX Design Principles',
  'Machine Learning with Python',
  'Cloud Computing with AWS',
  'Mobile App Development',
  'Cybersecurity Essentials'
];

const MODULE_TITLES = [
  'Introduction and Setup',
  'Core Fundamentals',
  'Advanced Concepts',
  'Project Development',
  'Best Practices and Deployment',
  'Final Assessment'
];

const LESSON_VIDEO_DATA = [
  { provider: 'youtube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 600 },
  { provider: 'youtube', url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0', duration: 900 },
  { provider: 'youtube', url: 'https://www.youtube.com/watch?v=hvL1339luv0', duration: 1200 },
  { provider: 'vimeo', url: 'https://vimeo.com/76979871', duration: 450 },
  { provider: 'vimeo', url: 'https://vimeo.com/253989945', duration: 800 },
];

const LESSON_THEORY_CONTENT = [
  'This lesson covers the fundamental concepts you need to understand before moving forward.',
  'In this section, we\'ll explore advanced techniques and best practices for professional development.',
  'Understanding these principles will help you build more robust and scalable applications.',
  'Let\'s dive deep into the architecture and design patterns that power modern software systems.',
  'This comprehensive guide will walk you through real-world scenarios and practical implementations.'
];

const QUIZ_SETTINGS = {
  time_limit: 1800, // 30 minutes
  pass_score: 70,
  shuffle_questions: true
};

// Seed categories
const seedCategories = async () => {
  try {
    console.log('Seeding categories...');

    const courseCategories = [
      { name: 'Web Development', slug: 'web-development', type: 'course', icon: '💻', color: '#3B82F6', sort_order: 1 },
      { name: 'Data Science', slug: 'data-science', type: 'course', icon: '📊', color: '#10B981', sort_order: 2 },
      { name: 'Programming', slug: 'programming', type: 'course', icon: '👨‍💻', color: '#8B5CF6', sort_order: 3 },
      { name: 'Design', slug: 'design', type: 'course', icon: '🎨', color: '#F59E0B', sort_order: 4 },
      { name: 'Business', slug: 'business', type: 'course', icon: '💼', color: '#EF4444', sort_order: 5 },
      { name: 'Marketing', slug: 'marketing', type: 'course', icon: '📈', color: '#06B6D4', sort_order: 6 },
      { name: 'Cloud Computing', slug: 'cloud-computing', type: 'course', icon: '☁️', color: '#6366F1', sort_order: 7 },
      { name: 'Cybersecurity', slug: 'cybersecurity', type: 'course', icon: '🔒', color: '#DC2626', sort_order: 8 },
      { name: 'Mobile Development', slug: 'mobile-development', type: 'course', icon: '📱', color: '#84CC16', sort_order: 9 },
      { name: 'AI & Machine Learning', slug: 'ai-machine-learning', type: 'course', icon: '🤖', color: '#EC4899', sort_order: 10 },
      { name: 'DevOps', slug: 'devops', type: 'course', icon: '⚙️', color: '#64748B', sort_order: 11 },
      { name: 'Database', slug: 'database', type: 'course', icon: '🗄️', color: '#059669', sort_order: 12 },
      { name: 'Game Development', slug: 'game-development', type: 'course', icon: '🎮', color: '#7C3AED', sort_order: 13 },
      { name: 'Blockchain', slug: 'blockchain', type: 'course', icon: '⛓️', color: '#F97316', sort_order: 14 },
      { name: 'Other', slug: 'other', type: 'course', icon: '📚', color: '#6B7280', sort_order: 15 }
    ];

    const quizCategories = [
      { name: 'Mathematics', slug: 'mathematics', type: 'quiz', icon: '🔢', color: '#3B82F6', sort_order: 1 },
      { name: 'Science', slug: 'science', type: 'quiz', icon: '🧪', color: '#10B981', sort_order: 2 },
      { name: 'History', slug: 'history', type: 'quiz', icon: '📜', color: '#F59E0B', sort_order: 3 },
      { name: 'Geography', slug: 'geography', type: 'quiz', icon: '🌍', color: '#EF4444', sort_order: 4 },
      { name: 'Literature', slug: 'literature', type: 'quiz', icon: '📖', color: '#06B6D4', sort_order: 5 },
      { name: 'Languages', slug: 'languages', type: 'quiz', icon: '🌐', color: '#6366F1', sort_order: 6 },
      { name: 'Programming', slug: 'programming-quiz', type: 'quiz', icon: '👨‍💻', color: '#8B5CF6', sort_order: 7 },
      { name: 'Business', slug: 'business-quiz', type: 'quiz', icon: '💼', color: '#DC2626', sort_order: 8 },
      { name: 'General Knowledge', slug: 'general-knowledge', type: 'quiz', icon: '🧠', color: '#84CC16', sort_order: 9 },
      { name: 'Custom', slug: 'custom', type: 'quiz', icon: '✨', color: '#EC4899', sort_order: 10 }
    ];

    const allCategories = [...courseCategories, ...quizCategories];

    for (const categoryData of allCategories) {
      try {
        const existingCategory = await Category.findOne({ slug: categoryData.slug });
        if (!existingCategory) {
          await Category.create(categoryData);
        }
      } catch (error) {
        // Skip if duplicate (already exists)
        if (error.code !== 11000) {
          throw error;
        }
      }
    }

    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    console.log('Seeding users...');

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        wallet: { balance: 1000000, currency: 'VND', is_active: true },
        isEmailVerified: true,
      },
      {
        name: 'John Doe (Instructor)',
        email: 'john@example.com',
        password: 'password123',
        role: 'student', // Use student role, mark as instructor via name
        wallet: { balance: 500000, currency: 'VND', is_active: true },
        isEmailVerified: true,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'student',
        wallet: { balance: 250000, currency: 'VND', is_active: true },
        isEmailVerified: true,
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'student',
        wallet: { balance: 150000, currency: 'VND', is_active: true },
        isEmailVerified: true,
      }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
      }
    }

    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Seed courses
const seedCourses = async () => {
  try {
    console.log('Seeding courses...');

    const instructors = await User.find({ role: 'student' }); // Find all students, will use first one as instructor
    const categories = await Category.find({ type: 'course' });

    if (instructors.length === 0) {
      console.log('No users found, skipping course seeding');
      return;
    }

    if (categories.length === 0) {
      console.log('No categories found, skipping course seeding');
      return;
    }

    for (let i = 0; i < 24; i++) {
      const randomTitle = COURSE_TITLES[i % COURSE_TITLES.length];
      const randomCategory = categories[i % categories.length];
      const randomInstructor = instructors[0]; // Use first instructor for all courses

      const course = {
        title: `${randomTitle} ${i + 1}`,
        slug: `${randomTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${i + 1}`,
        description: `${randomTitle} - Learn from industry experts and build real-world projects.`,
        instructor_id: randomInstructor._id,
        instructor: randomInstructor.name,
        category_id: randomCategory._id,
        pricing: {
          price: Math.floor(Math.random() * 200000) + 50000,
          currency: 'VND',
          is_free: Math.random() < 0.1,
        },
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        totalRatings: Math.floor(Math.random() * 5000) + 100,
        students: Math.floor(Math.random() * 50000) + 1000,
        level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
        duration: `${Math.floor(Math.random() * 40) + 10} hours`,
        type: ['Course', 'Specialization', 'Professional Certificate'][Math.floor(Math.random() * 3)],
        tags: [randomCategory.name, randomInstructor.name.split(' ')[0]],
        is_published: Math.random() > 0.2,
      };

      try {
        await Course.create(course);
      } catch (error) {
        // Skip if duplicate (already exists)
        if (error.code !== 11000) {
          throw error;
        }
      }
    }

    console.log('Courses seeded successfully');
  } catch (error) {
    console.error('Error seeding courses:', error);
  }
};

// Seed enrollments
const seedEnrollments = async () => {
  try {
    console.log('Seeding enrollments...');

    const students = await User.find({ role: 'student' });
    const courses = await Course.find({ is_published: true });

    for (const student of students) {
      // Each student enrolls in 3-6 courses
      const enrolledCount = Math.floor(Math.random() * 4) + 3;
      const shuffledCourses = courses.sort(() => 0.5 - Math.random());
      const enrolledCourses = shuffledCourses.slice(0, enrolledCount);

      for (const course of enrolledCourses) {
        const progress = Math.floor(Math.random() * 101);
        const enrollment = {
          user_id: student._id,
          course_id: course._id,
          progress_percent: progress,
          completedLessons: Math.floor((progress / 100) * 20),
          totalLessons: 20,
          lastAccessedAt: progress > 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : '',
          status: progress === 100 ? 'completed' : 'active',
        };

        await Enrollment.create(enrollment);
      }
    }

    console.log('Enrollments seeded successfully');
  } catch (error) {
    console.error('Error seeding enrollments:', error);
  }
};

// Seed modules
const seedModules = async () => {
  try {
    console.log('Seeding modules...');

    const courses = await Course.find({ is_published: true });

    if (courses.length === 0) {
      console.log('No published courses found, skipping module seeding');
      return;
    }

    for (const course of courses.slice(0, 5)) { // Limit to first 5 courses
      // Create 3-5 modules per course
      const moduleCount = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < moduleCount; i++) {
        const module = {
          course_id: course._id,
          title: `${MODULE_TITLES[i % MODULE_TITLES.length]} ${i + 1}`,
          lesson_ids: [] // Will be populated when lessons are created
        };

        await Module.create(module);
      }
    }

    console.log('Modules seeded successfully');
  } catch (error) {
    console.error('Error seeding modules:', error);
  }
};

// Seed lessons
const seedLessons = async () => {
  try {
    console.log('Seeding lessons...');

    const modules = await Module.find();
    const courses = await Course.find();

    if (modules.length === 0) {
      console.log('No modules found, skipping lesson seeding');
      return;
    }

    for (const module of modules) {
      // Create 3-6 lessons per module
      const lessonCount = Math.floor(Math.random() * 4) + 3;

      for (let i = 0; i < lessonCount; i++) {
        const lessonType = ['video', 'theory', 'quiz'][Math.floor(Math.random() * 3)];
        let resourceId;

        // Create the resource based on lesson type
        switch (lessonType) {
          case 'video':
            const videoData = LESSON_VIDEO_DATA[Math.floor(Math.random() * LESSON_VIDEO_DATA.length)];
            const videoResource = await LessonVideo.create(videoData);
            resourceId = videoResource._id;
            break;

          case 'theory':
            const theoryContent = LESSON_THEORY_CONTENT[Math.floor(Math.random() * LESSON_THEORY_CONTENT.length)];
            const theoryResource = await LessonTheory.create({
              content_html: theoryContent,
              reading_time_minutes: Math.floor(Math.random() * 15) + 5
            });
            resourceId = theoryResource._id;
            break;

          case 'quiz':
            // Will create quiz later with questions
            const quizResource = await LessonQuiz.create({ settings: QUIZ_SETTINGS, question_ids: [] });
            resourceId = quizResource._id;
            break;
        }

        const lesson = {
          module_id: module._id,
          course_id: module.course_id,
          title: `${lessonType.charAt(0).toUpperCase() + lessonType.slice(1)} Lesson ${i + 1}`,
          slug: `${lessonType}-lesson-${i + 1}`.toLowerCase().replace(/\s+/g, '-'),
          type: lessonType,
          resource_id: resourceId,
          is_preview: i === 0 // First lesson is preview
        };

        await Lesson.create(lesson);
      }
    }

    console.log('Lessons seeded successfully');
  } catch (error) {
    console.error('Error seeding lessons:', error);
  }
};

// Seed questions
const seedQuestions = async () => {
  try {
    console.log('Seeding questions...');

    // Single choice questions
    const singleChoiceQuestions = [
      {
        content: 'What does HTML stand for?',
        difficulty: 'easy',
        options: [
          { id: 1, text: 'Hyper Text Markup Language', is_correct: true },
          { id: 2, text: 'High Tech Modern Language', is_correct: false },
          { id: 3, text: 'Home Tool Markup Language', is_correct: false },
          { id: 4, text: 'Hyperlink Text Management Language', is_correct: false }
        ],
        explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.'
      },
      {
        content: 'Which of the following is NOT a JavaScript data type?',
        difficulty: 'medium',
        options: [
          { id: 1, text: 'String', is_correct: false },
          { id: 2, text: 'Boolean', is_correct: false },
          { id: 3, text: 'Integer', is_correct: true },
          { id: 4, text: 'Object', is_correct: false }
        ],
        explanation: 'JavaScript has Number (not Integer), String, Boolean, Object, Undefined, and Null as primitive data types.'
      },
      {
        content: 'What is the purpose of the CSS box model?',
        difficulty: 'medium',
        options: [
          { id: 1, text: 'To create 3D graphics', is_correct: false },
          { id: 2, text: 'To define the layout and design of web pages', is_correct: true },
          { id: 3, text: 'To handle user interactions', is_correct: false },
          { id: 4, text: 'To manage database connections', is_correct: false }
        ],
        explanation: 'The CSS box model describes the rectangular boxes that are generated for elements in the document tree.'
      }
    ];

    // Multiple choice questions
    const multipleChoiceQuestions = [
      {
        content: 'Which of the following are front-end technologies? (Select all that apply)',
        difficulty: 'easy',
        options: [
          { id: 1, text: 'HTML', is_correct: true },
          { id: 2, text: 'CSS', is_correct: true },
          { id: 3, text: 'JavaScript', is_correct: true },
          { id: 4, text: 'Node.js', is_correct: false },
          { id: 5, text: 'Python', is_correct: false }
        ],
        explanation: 'HTML, CSS, and JavaScript are front-end technologies used for building user interfaces.'
      },
      {
        content: 'Which HTTP methods are considered safe? (Select all that apply)',
        difficulty: 'hard',
        options: [
          { id: 1, text: 'GET', is_correct: true },
          { id: 2, text: 'HEAD', is_correct: true },
          { id: 3, text: 'OPTIONS', is_correct: true },
          { id: 4, text: 'POST', is_correct: false },
          { id: 5, text: 'PUT', is_correct: false }
        ],
        explanation: 'Safe HTTP methods (GET, HEAD, OPTIONS) are those that should not have side effects on the server.'
      }
    ];

    // Fill-in questions
    const fillInQuestions = [
      {
        content: 'The acronym API stands for _____.',
        difficulty: 'easy',
        correct_answers: ['Application Programming Interface', 'application programming interface'],
        case_sensitive: false,
        explanation: 'API stands for Application Programming Interface.'
      },
      {
        content: 'In JavaScript, the keyword _____ is used to declare a block-scoped variable.',
        difficulty: 'medium',
        correct_answers: ['let', 'const'],
        case_sensitive: true,
        explanation: 'Both let and const are used to declare block-scoped variables in JavaScript.'
      }
    ];

    // Create single choice questions
    for (const q of singleChoiceQuestions) {
      const questionDetail = await QuestionSingleChoice.create({
        options: q.options,
        explanation: q.explanation
      });

      await Question.create({
        type: 'single_choice',
        difficulty: q.difficulty,
        content: q.content,
        resource_id: questionDetail._id
      });
    }

    // Create multiple choice questions
    for (const q of multipleChoiceQuestions) {
      const questionDetail = await QuestionMultipleChoice.create({
        options: q.options,
        explanation: q.explanation
      });

      await Question.create({
        type: 'multiple_choice',
        difficulty: q.difficulty,
        content: q.content,
        resource_id: questionDetail._id
      });
    }

    // Create fill-in questions
    for (const q of fillInQuestions) {
      const questionDetail = await QuestionFillIn.create({
        correct_answers: q.correct_answers,
        case_sensitive: q.case_sensitive,
        explanation: q.explanation
      });

      await Question.create({
        type: 'fill_in',
        difficulty: q.difficulty,
        content: q.content,
        resource_id: questionDetail._id
      });
    }

    console.log('Questions seeded successfully');
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
};

// Seed quiz questions linking
const seedQuizQuestions = async () => {
  try {
    console.log('Linking questions to quizzes...');

    const quizzes = await LessonQuiz.find();
    const questions = await Question.find();

    if (quizzes.length === 0 || questions.length === 0) {
      console.log('No quizzes or questions found, skipping quiz-question linking');
      return;
    }

    // Assign 5-10 random questions to each quiz
    for (const quiz of quizzes) {
      const questionCount = Math.floor(Math.random() * 6) + 5;
      const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffledQuestions.slice(0, questionCount);

      quiz.question_ids = selectedQuestions.map(q => q._id);
      await quiz.save();
    }

    console.log('Quiz questions linked successfully');
  } catch (error) {
    console.error('Error linking quiz questions:', error);
  }
};

// Seed attempts
const seedAttempts = async () => {
  try {
    console.log('Seeding quiz attempts...');

    const quizLessons = await Lesson.find({ type: 'quiz' });
    const users = await User.find();

    if (quizLessons.length === 0 || users.length === 0) {
      console.log('No quiz lessons or users found, skipping attempt seeding');
      return;
    }

    for (const user of users) {
      // Each user attempts 2-4 quizzes
      const attemptCount = Math.floor(Math.random() * 3) + 2;
      const shuffledQuizzes = quizLessons.sort(() => 0.5 - Math.random());
      const selectedQuizzes = shuffledQuizzes.slice(0, attemptCount);

      for (const quizLesson of selectedQuizzes) {
        // Get questions for this quiz
        const quiz = await LessonQuiz.findById(quizLesson.resource_id).populate('question_ids');
        if (!quiz || quiz.question_ids.length === 0) continue;

        const score = Math.floor(Math.random() * 101);
        const isPassed = score >= QUIZ_SETTINGS.pass_score;

        const answers = quiz.question_ids.map(question => ({
          question_id: question._id,
          is_correct: Math.random() > 0.4 // 60% correct answers
        }));

        const attempt = {
          user_id: user._id,
          quiz_lesson_id: quizLesson._id,
          score,
          is_passed: isPassed,
          answers,
          started_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          submitted_at: new Date()
        };

        await Attempt.create(attempt);
      }
    }

    console.log('Attempts seeded successfully');
  } catch (error) {
    console.error('Error seeding attempts:', error);
  }
};

// Seed classrooms
const seedClassrooms = async () => {
  try {
    console.log('Seeding classrooms...');

    const users = await User.find();
    const courses = await Course.find();

    if (users.length === 0) {
      console.log('No users found, skipping classroom seeding');
      return;
    }

    const classroomNames = [
      'Web Development Class 2024',
      'Data Science Bootcamp',
      'Python Programming Group',
      'React.js Workshop',
      'Full Stack Development'
    ];

    for (let i = 0; i < 5; i++) {
      const admin = users[Math.floor(Math.random() * users.length)];
      const studentCount = Math.floor(Math.random() * 8) + 3; // 3-10 students
      const shuffledUsers = users.filter(u => u._id.toString() !== admin._id.toString()).sort(() => 0.5 - Math.random());
      const students = shuffledUsers.slice(0, studentCount);

      const members = [
        { user_id: admin._id, role: 'admin' },
        ...students.map(student => ({ user_id: student._id, role: 'student' }))
      ];

      // Assign 1-3 courses to each classroom
      const courseCount = Math.floor(Math.random() * 3) + 1;
      const shuffledCourses = courses.sort(() => 0.5 - Math.random());
      const assignedCourses = shuffledCourses.slice(0, courseCount);

      const classroom = {
        name: `${classroomNames[i % classroomNames.length]} ${i + 1}`,
        members,
        assigned_courses: assignedCourses.map(c => c._id),
        imageURL: `https://picsum.photos/400/200?random=${i + 1}`
      };

      await Classroom.create(classroom);
    }

    console.log('Classrooms seeded successfully');
  } catch (error) {
    console.error('Error seeding classrooms:', error);
  }
};

// Seed messages
const seedMessages = async () => {
  try {
    console.log('Seeding messages...');

    const classrooms = await Classroom.find().populate('members.user_id');

    if (classrooms.length === 0) {
      console.log('No classrooms found, skipping message seeding');
      return;
    }

    const messageContents = [
      'Welcome to our classroom! Let\'s start learning together.',
      'Does anyone have questions about the last lesson?',
      'Great work on the assignment everyone!',
      'Remember to complete the quiz by Friday.',
      'I\'m excited to see your project submissions.',
      'Let\'s discuss the homework in our next session.',
      'The next module will be challenging but rewarding.',
      'Feel free to ask for help anytime.',
      'Congratulations on completing the course!',
      'See you in the next class session.'
    ];

    for (const classroom of classrooms) {
      // Create 5-15 messages per classroom
      const messageCount = Math.floor(Math.random() * 11) + 5;

      for (let i = 0; i < messageCount; i++) {
        const sender = classroom.members[Math.floor(Math.random() * classroom.members.length)].user_id;

        const message = {
          classroom_id: classroom._id,
          sender_id: sender._id,
          content: messageContents[Math.floor(Math.random() * messageContents.length)],
          type: 'text'
        };

        await Message.create(message);
      }
    }

    console.log('Messages seeded successfully');
  } catch (error) {
    console.error('Error seeding messages:', error);
  }
};

// Seed notifications
const seedNotifications = async () => {
  try {
    console.log('Seeding notifications...');

    const users = await User.find();

    if (users.length === 0) {
      console.log('No users found, skipping notification seeding');
      return;
    }

    const notificationContents = [
      'Your course enrollment has been confirmed.',
      'New lesson available in your enrolled course.',
      'Quiz deadline approaching - complete before Friday.',
      'Congratulations! You passed the JavaScript quiz.',
      'Your assignment has been graded.',
      'New message in your classroom.',
      'Course completion certificate is now available.',
      'Payment received for course purchase.',
      'Weekly progress report: You\'re doing great!',
      'Reminder: Complete your profile to unlock premium features.'
    ];

    const types = ['system', 'promotion', 'reminder'];

    for (const user of users) {
      // Create 3-8 notifications per user
      const notificationCount = Math.floor(Math.random() * 6) + 3;

      for (let i = 0; i < notificationCount; i++) {
        const notification = {
          recipient_id: user._id,
          content: notificationContents[Math.floor(Math.random() * notificationContents.length)],
          type: types[Math.floor(Math.random() * types.length)],
          is_read: Math.random() > 0.6 // 40% unread
        };

        await Notification.create(notification);
      }
    }

    console.log('Notifications seeded successfully');
  } catch (error) {
    console.error('Error seeding notifications:', error);
  }
};

// Seed transactions
const seedTransactions = async () => {
  try {
    console.log('Seeding transactions...');

    const users = await User.find();
    const courses = await Course.find();

    if (users.length === 0) {
      console.log('No users found, skipping transaction seeding');
      return;
    }

    for (const user of users) {
      // Each user has 3-8 transactions
      const transactionCount = Math.floor(Math.random() * 6) + 3;

      for (let i = 0; i < transactionCount; i++) {
        const types = ['deposit', 'purchase', 'refund', 'withdrawal'];
        const statuses = ['completed', 'pending', 'failed'];
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        let amount, courseId, description;

        switch (type) {
          case 'deposit':
            amount = Math.floor(Math.random() * 500000) + 50000;
            description = ['Top up via MoMo', 'Top up via credit card', 'Bank transfer', 'Top up via PayPal'][Math.floor(Math.random() * 4)];
            break;
          case 'purchase':
            if (courses.length > 0) {
              const course = courses[Math.floor(Math.random() * courses.length)];
              amount = -course.pricing.price;
              courseId = course._id.toString();
              description = 'Course purchase';
            } else {
              amount = -(Math.floor(Math.random() * 200000) + 50000);
              description = 'Purchase';
            }
            break;
          case 'refund':
            amount = Math.floor(Math.random() * 200000) + 50000;
            description = ['Refund for cancelled course', 'Partial refund', 'Full refund'][Math.floor(Math.random() * 3)];
            break;
          case 'withdrawal':
            amount = -(Math.floor(Math.random() * 100000) + 50000);
            description = ['Cash withdrawal', 'Bank transfer withdrawal'][Math.floor(Math.random() * 2)];
            break;
        }

        const transaction = {
          user_id: user._id,
          type,
          amount,
          balance_after: user.wallet.balance + amount,
          status,
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          courseId: courseId || '',
          description,
        };

        await Transaction.create(transaction);

        // Update user wallet balance
        user.wallet.balance += amount;
        await user.save();
      }
    }

    console.log('Transactions seeded successfully');
  } catch (error) {
    console.error('Error seeding transactions:', error);
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    await seedUsers();
    await seedCategories();
    await seedCourses();
    await seedModules();
    await seedLessons();
    await seedQuestions();
    await seedQuizQuestions();
    await seedAttempts();
    await seedEnrollments();
    await seedClassrooms();
    await seedMessages();
    await seedNotifications();
    await seedTransactions();

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Connect to database and run seed
const runSeed = async () => {
  try {
    const config = require('./src/config/config');

    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log('Connected to MongoDB');

    await seedDatabase();
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  runSeed();
}

module.exports = { seedDatabase };
