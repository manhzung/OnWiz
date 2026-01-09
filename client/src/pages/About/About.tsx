/**
 * About page - Coursera style
 */

import { Card } from '../../components/common/Card';

// ============================================================================
// Component
// ============================================================================

export const About = () => {
  return (
    <div className="w-full bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            Learn without limits
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <Card>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to make quality education more accessible to everyone, regardless of where they are. 
                We believe that education is the key to unlocking new opportunities and personal growth.
              </p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">What We Offer</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We partner with leading universities and companies to offer courses, Specializations, 
                and Professional Certificates that help learners build job-ready skills.
              </p>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">10,000+ Courses</h3>
                  <p className="text-sm text-gray-600">From top universities and companies</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">350+ Partners</h3>
                  <p className="text-sm text-gray-600">Leading institutions worldwide</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Professional Certificates</h3>
                  <p className="text-sm text-gray-600">Job-ready skills in high-demand fields</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Online Degrees</h3>
                  <p className="text-sm text-gray-600">Accredited bachelor's and master's programs</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To become the leading online learning platform where everyone can learn, develop skills, 
                and achieve their career goals. We are committed to providing the best learning experience 
                for our learners.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
