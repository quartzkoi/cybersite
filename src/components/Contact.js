import React, { useState } from 'react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactTime, setContactTime] = useState('');
  const [availability, setAvailability] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Name: ${name}\nEmail: ${email}\nPreferred Contact Time: ${contactTime}\nAvailable on Weekends: ${availability}`);
    // Reset form fields
    setName('');
    setEmail('');
    setContactTime('');
    setAvailability('');
  };

  return (
    <div className="grid-item">
      <h3>Questions? Answers? Looking for help? Contact me!</h3>
      <form id="contactForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Please leave your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="and a good contact email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>What is a good time to contact you?</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="contact"
              value="Mornings"
              checked={contactTime === 'Mornings'}
              onChange={(e) => setContactTime(e.target.value)}
              required
            />
            <label className="form-check-label">Mornings</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="contact"
              value="Afternoons"
              checked={contactTime === 'Afternoons'}
              onChange={(e) => setContactTime(e.target.value)}
              required
            />
            <label className="form-check-label">Afternoons</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="contact"
              value="Evenings"
              checked={contactTime === 'Evenings'}
              onChange={(e) => setContactTime(e.target.value)}
              required
            />
            <label className="form-check-label">Evenings</label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="availability">Are you available on weekends?</label>
          <select
            className="form-control"
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
          >
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="maybe">Depends, I suppose, you're free to try</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default Contact;