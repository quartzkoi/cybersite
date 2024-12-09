import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import NotrisImage from '../images/notris.png';

const Projects = () => {
  const projects = [
    {
      title: "NoTris",
      description: "Simple recreation of a popular falling block puzzle game.",
      url: "/project1",
      image: NotrisImage,  // Use imported image variable
    },
    {
      title: "Test project",
      description: "Test Project Description. 'This is where I would put a second project if I had one'",
      url: "/project2",
      image: '/images/project2.png',
    },
  ];

  return (
    <div className="projects-container">
      <h2 className="title">Projects</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <Link key={index} to={project.url} className="project-grid-item">
            <h4>{project.title}</h4>
            <p>{project.description}</p>
            <div className="project-image">
              <img src={project.image} alt={project.title} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;
