import React from 'react';
import Background from '../bg.gif';
import Overlay from './Overlay';
import Header from './Header';
import Image from './Image';
import Experience from './Experience';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Contact from './Contact';

const Home = ({ showContent }) => {
  return (
    <div style={{ backgroundImage: `url(${Background})` }} className="background-container">
      <Overlay />
      {showContent && (
        <>
          <Header />
          <Image />
          <main>
            <section id="experience" className="section-spacing">
              <Experience />
            </section>
            <section id="projects" className="section-spacing">
              <Projects />
            </section>
            <section id="testimonials" className="section-spacing">
              <Testimonials />
            </section>
            <section id="contact" className="section-spacing">
              <Contact />
            </section>
          </main>
        </>
      )}
    </div>
  );
};

export default Home;