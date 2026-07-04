import React from 'react';
import { MainLayout } from '../layouts/MainLayout';

export const AboutPage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gradient-cyan">About SmartRecruit</h2>
          <p className="text-slate-400 text-sm mt-2">Next-generation local intelligence candidate recruitment portal</p>
        </div>

        <div className="glass-panel p-8 border border-indigo-500/10 space-y-6 leading-relaxed text-sm text-slate-300">
          <p>
            SmartRecruit is designed to streamline the hiring pipeline by automating candidate evaluation metrics. By uploading a standard PDF resume, our backend extracts relevant skills, education, and career experience blocks.
          </p>
          <p>
            Unlike typical paid platforms, SmartRecruit leverages a local rule-based matching engine. We calculate a weighted index of qualifications (Skills, Experience, Education) against job posting definitions, instantly outputting a suitability score (0-100) and recommendation labels.
          </p>
          <p>
            This guarantees recruiters can review candidates instantly sorted by their relevance, while candidates receive immediate feedback on how well their qualifications align with job descriptions.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
