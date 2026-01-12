import React from 'react';
import { CALENDLY_URL, DASHBOARD_URL } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Content */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            v2.0 Now Available
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Security that breaks the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary text-glow">
              fourth wall
            </span>
          </h1>
          
          <p className="text-lg text-textMuted mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Unify compliance, risk, and threat detection in a single autonomous platform. 
            Stop reacting to tickets. Start orchestrating defense.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a 
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary text-black font-bold rounded-lg hover:bg-primaryDark transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transform hover:-translate-y-0.5"
            >
              Schedule a Demo
            </a>
            <a 
              href={DASHBOARD_URL}
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-textMuted">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>SOC 2 Type II Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>14-Day Free Trial</span>
            </div>
          </div>
        </div>

        {/* Visual / Spline Placeholder */}
        <div className="relative w-full aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-surfaceHighlight/30 backdrop-blur-sm shadow-2xl group">
          {/* 
            TODO: Replace the content below with your Spline Embed URL or similar 3D library.
            Example: <iframe src='https://my.spline.design/example' ... />
          */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Animated Fallback */}
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-4 border-2 border-dashed border-secondary/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full backdrop-blur-md border border-white/5 flex items-center justify-center">
                <svg className="w-20 h-20 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-0 right-0 p-3 bg-surface border border-white/10 rounded-lg shadow-xl animate-bounce">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-mono text-white">System Secure</span>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-0 p-3 bg-surface border border-white/10 rounded-lg shadow-xl animate-pulse delay-75">
                 <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-xs font-mono text-white">Scanning...</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 text-xs text-textMuted opacity-50 font-mono">
            Interactive Visual Placeholder
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;