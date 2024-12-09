import React, { useEffect, useRef } from 'react';
import '../index.css';

function Experience() {
  const observerRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '10px'
      }
    );

    // Observe all grid items
    const items = document.querySelectorAll('.grid-item');
    items.forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="resume-section">
      <h2 className="title">Personal Experience</h2>
      <div className="grid-container">
        <div className="grid-item opacity-0 transition-all duration-1000">
          <h3 className="section-spacing">Work History</h3>
          <ul className="experience-list">
            <li className="experience-item">
              Junior Cloud Engineer at ABC Tech, San Francisco, CA
              <ul className="sub-list">
                <li>Assisted in maintenance of cloud infrastructure</li>
                <li>Collaborated with senior engineers on various projects</li>
                <li>Provided support for cloud-based applications to clients</li>
              </ul>
            </li>
            <li className="experience-item">
              Cloud Support Specialist at XYZ Cloud Co., Seattle, WA
              <ul className="sub-list">
                <li>Responded to customer inquiries and resolved platform issues</li>
                <li>Optimized cloud resources for performance</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="grid-item opacity-0 transition-all duration-1000">
          <h3 className="section-spacing">Gig Work</h3>
          <ul className="experience-list">
            <li className="experience-item">
              Freelance Cloud Consultant
              <ul className="sub-list">
                <li>Assisted local businesses in migrating to cloud infrastructure</li>
                <li>Implemented tight security practices for cloud environments</li>
                <li>Provided training to staff on cloud technologies</li>
              </ul>
            </li>
            <li className="experience-item">
              Cloud Project Intern
              <ul className="sub-list">
                <li>Supported cloud projects through research and documentation</li>
                <li>Assisted in executing cloud migration plans</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="grid-item opacity-0 transition-all duration-1000">
          <h3 className="section-spacing">Education</h3>
          <ul className="experience-list">
            <li>WSU Tech 2022-2024 - Completed an Associates degree in Cloud Computing</li>
            <li>Wichita State University 2020-2022 - Took General Education courses in Computer Science</li>
            <li>Kansas City High School - 2016-2020</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Experience;