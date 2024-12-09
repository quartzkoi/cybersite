import React, { useState } from 'react';
import '../index.css';

const testimonialsData = [
  {
    name: "Kael O'Neill, Mentor",
    testimonial: "I've enjoyed having Trent around to help, he's clearly motivated to learn, and apply what he knows to fix any problems, rarely without making new ones!",
    contact: "(123) 456-7890; KO3378@outlook.com",
    id: "collapseOne"
  },
  {
    name: "Colin Leftwich, Coworker",
    testimonial: "Trent is a hard worker, and a pleasure to be around, any time we would come across an issue that he didn't immediately have a solution for, he would not stop seeking answers until he solved our problem!",
    contact: "(987) 654-3210; CLDEV22098@protonmail.com",
    id: "collapseTwo"
  },
  {
    name: "Ian Christopher, Coworker",
    testimonial: "Trent was a big help in a few projects that I had worked on with him, he's very open to comments and questions about whatever he's working on, he knows he's able to make mistakes and learn from them",
    contact: "(975) 310-8642; 9910ICMTG@gmail.com",
    id: "collapseThree"
  }
];

const Testimonials = () => {
  const [openId, setOpenId] = useState(null);

  const toggleCollapse = (id) => {
    setOpenId(openId === id ? null : id); // Toggle collapse
  };

  return (
    <div className="resume-section">
      <h2 className="text-center">Testimonials</h2>
      <div id="accordion">
        {testimonialsData.map((testimonial) => (
          <div className="card" key={testimonial.id}>
            <div className="card-header" id={`heading-${testimonial.id}`}>
              <button 
                className="btn btn-link" 
                onClick={() => toggleCollapse(testimonial.id)} 
                aria-controls={testimonial.id}
                aria-expanded={openId === testimonial.id}
              >
                {testimonial.name}
              </button>
            </div>
            <div 
              id={testimonial.id} 
              className={`card-body ${openId === testimonial.id ? 'show' : ''}`}
            >
              {testimonial.testimonial} <br /><br />
              {testimonial.contact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
