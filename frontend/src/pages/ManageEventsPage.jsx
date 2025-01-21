import React from 'react';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faFilter, faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const EventsPage = () => {
  return (
    <div style={styles.container}>
      <Header title="AirBlue System" />
      <main style={styles.main}>
        <section style={styles.events}>
          {/* Container for back button and title */}
          <div style={styles.headerRow}>
            <Link to="/home" style={styles.backButton}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <h2 style={styles.title}>Events</h2>
          </div>

          {/* Filter Section */}
          <div style={styles.filterContainer}>
            <input
              type="text"
              placeholder="Event Title"
              style={styles.filterInput}
              value="IEEE Board Meeting 2024"
            />
            <input
              type="text"
              placeholder="Event Type"
              style={styles.filterInput}
              value="Board Meeting"
            />
            <FontAwesomeIcon icon={faFilter} style={styles.icon} />
            <button style={styles.clearButton}>Clear Filters</button>
            <button style={styles.searchButton}>Search</button>
            <FontAwesomeIcon icon={faCog} style={styles.icon} />
          </div>

          <h3 style={styles.month}>October</h3>

          <div style={styles.eventItem}>
  <div style={styles.eventHeader}>
    <div style={styles.eventDetails}>
      <p>Date: 10/31/2024</p>
      <p>Event Type: Board Meeting (Internal)</p>
      <p>Location: Rochester Conference Center</p>
      <p>Budget per attendee: $300</p>
      <p>Event Budget: $5000</p>
      <p>
        Attendees:{" "}
        <a href="/manageattendeespages" style={styles.link}>
          Manage attendees
        </a>
      </p>
      <p>Notes:</p>
    </div>
    <div style={styles.iconContainer}>
      <FontAwesomeIcon icon={faPenToSquare} style={styles.icon} />
      <FontAwesomeIcon icon={faTrash} style={styles.icon} />
    </div>
  </div>
</div>
<h3 style={styles.eventTitle}>IEEE Board Meeting 2024</h3>
<div style={styles.eventItem}></div>
<h3 style={styles.eventTitle}>IEEE Conference: ML Research 2024</h3>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '800px',
    marginBottom: '20px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'left',
    textDecoration: 'none',
    marginTop: '170px',
    color: '#0B2853',
    fontSize: '16px',
    fontWeight: '600',
    marginRight: '315px',
    marginLeft:'-345px' // Adjusts spacing between back button and title
  },
  title: {
    fontSize: '24px',
    marginTop: '170px',
    marginBottom:'5px',
    color: '#0B2853',
    fontWeight: '600',
    marginLeft: '10px', // Moves "Events" closer to the back button
  },
  month: {
  color: '#0B2853',
  },
  events: {
    width: '100%',
    maxWidth: '800px',
  },
  eventItem: {
    border: '1px solid #ccc',
    backgroundColor: 'lightgray',
    padding: '70px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  eventTitle: {
    marginTop: '0',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    fontSize: '18px',
    fontWeight: '**500**',
    color: '#0B2853',
  },
  eventDetails: {
    marginTop: '-20px',
    color: 'black',
    fontSize: '18px',
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
  },
  
  iconContainer: {
    display: 'flex',
    gap: '00px',
    position: 'absolute',
    top: '00px',
    right: '00px',
    fontSize: '25px',
  },
  
  icon: {
    color: '#0A306E',
    fontSize: '16px',
    cursor: 'pointer',
    margin: '0 10px',
    color: '#0B2853',
    
  },  
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'px',
    marginBottom: '20px',
    padding: '0px 0',
    borderBottom: '1px solid #ccc',
  },
  link: {
    color: '#0A306E',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  filterInput: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: 'black', // Add this line
    flex: '1',
  },
  
  clearButton: {
    backgroundColor: '#fff',
    color: '#0B2853',
    border: '1px solid #0B2853',
    borderRadius: '5px',
    padding: '5px 10px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  searchButton: {
    backgroundColor: '#0A306E',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  
};

export default EventsPage;
