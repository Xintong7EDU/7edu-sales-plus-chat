import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-display font-bold text-primary-700">7Edu AI Chat</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 leading-tight">
                Your Personal Education Counselor, <span className="text-primary-600">Powered by AI</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-xl">
                Get personalized guidance for your educational journey. Our AI chat system helps you navigate college applications, academic planning, and more.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/onboarding/form" 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-soft transition text-center"
                >
                  Start Your Journey
                </Link>
                <Link 
                  href="/onboarding/chat" 
                  className="border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg text-lg font-medium transition text-center"
                >
                  Skip to Chat
                </Link>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No login required</span>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-2xl shadow-soft p-4 border border-gray-100">
                <div className="bg-white rounded-xl p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="bg-primary-100 text-primary-800 p-3 rounded-lg max-w-[80%] self-start">
                      <p>Hi there! I'm your 7Edu AI counselor. How can I help with your educational journey today?</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%] self-end">
                      <p>I'm a high school junior looking for help with college applications.</p>
                    </div>
                    <div className="bg-primary-100 text-primary-800 p-3 rounded-lg max-w-[80%] self-start">
                      <p>Great! I can definitely help with that. Let's start by understanding your academic goals and interests. What kind of colleges are you interested in?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-6">How It Works</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">Our three-step process makes it easy to get personalized educational guidance</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center relative shadow-soft">
              <div className="bg-primary-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold absolute -top-5 left-1/2 transform -translate-x-1/2">1</div>
              <div className="pt-4">
                <h3 className="text-xl font-bold mb-2">Basic Information</h3>
                <p className="text-gray-600">Tell us about yourself, your grade level, GPA, and educational goals.</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center relative shadow-soft">
              <div className="bg-primary-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold absolute -top-5 left-1/2 transform -translate-x-1/2">2</div>
              <div className="pt-4">
                <h3 className="text-xl font-bold mb-2">Guided Chat</h3>
                <p className="text-gray-600">Chat with our AI counselor to discuss your specific educational needs and questions.</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center relative shadow-soft">
              <div className="bg-primary-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold absolute -top-5 left-1/2 transform -translate-x-1/2">3</div>
              <div className="pt-4">
                <h3 className="text-xl font-bold mb-2">Personalized Analysis</h3>
                <p className="text-gray-600">Receive a detailed analysis with recommendations tailored to your profile.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/onboarding/form" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-soft transition"
            >
              Start Your Journey Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">How 7Edu AI Chat Helps You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-soft border border-gray-100">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Guidance</h3>
              <p className="text-gray-600">Get customized advice based on your academic profile, interests, and goals.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-soft border border-gray-100">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Comprehensive Reports</h3>
              <p className="text-gray-600">Receive detailed reports with actionable insights to improve your college applications.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-soft border border-gray-100">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Counseling</h3>
              <p className="text-gray-600">Connect with professional counselors for in-depth guidance when you need it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">&copy; 2024 7Edu. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary-600 transition">Terms</a>
              <a href="#" className="text-gray-500 hover:text-primary-600 transition">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-primary-600 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
