import React, { useState } from 'react';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ManageAttendees = () => {
  // State for first and last name filters
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Sample list of attendees
  const [attendees, setAttendees] = useState([
    'Smith, John',
    'Smith, Jane',
    'Smith, Jazmin',
    'Smith, Joseph',
    'Smith, Louise'
  ]);

  // State for selected attendees to remove
  const [selectedAttendees, setSelectedAttendees] = useState([]);

  // Handle checkbox change for selecting attendees
  const handleCheckboxChange = (attendee) => {
    setSelectedAttendees(prevSelected => 
      prevSelected.includes(attendee) 
        ? prevSelected.filter(name => name !== attendee) 
        : [...prevSelected, attendee]
    );
  };

  // Function to remove selected attendees
  const removeAttendees = () => {
    setAttendees(prevAttendees => 
      prevAttendees.filter(attendee => !selectedAttendees.includes(attendee))
    );
    setSelectedAttendees([]); // Clear selected attendees after removal
  };

  // Function to clear filters
  const clearFilters = () => {
    setFirstName('');
    setLastName('');
  };

  return (
    <div style={styles.container}>
      <Header title="AirBlue System" />
      <main style={styles.main}>
        <section style={styles.attendees}>
          {/* Container for back button and title */}
          <div style={styles.headerRow}>
            <Link to="/events" style={styles.backButton}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <h2 style={styles.title1}>IEEE Board Meeting 2024</h2>
          </div>
          <h3 style={styles.title2}>Attendees</h3>

          {/* Filter Section */}
          <div style={styles.filterContainer}>
            <input
              type="text"
              placeholder="First name"
              style={styles.filterInput}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name"
              style={styles.filterInput}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <FontAwesomeIcon icon={faFilter} style={styles.icon} />
            <button onClick={clearFilters} style={styles.clearButton}>Clear Filters</button>
            <button style={styles.searchButton}>Search</button>
          </div>

          {/* List of attendees */}
          <div style={styles.attendeeList}>
            {attendees.map((attendee, index) => (
              <div key={index} style={styles.attendeeItem}>
                <input 
                  type="checkbox" 
                  checked={selectedAttendees.includes(attendee)} 
                  onChange={() => handleCheckboxChange(attendee)} 
                  style={styles.checkbox}
                />
                <span>{attendee}</span>
              </div>
            ))}
          </div>

          {/* Remove selected attendees button */}
          <button onClick={removeAttendees} style={styles.removeButton}>
            Remove Attendee(s)
          </button>

          {/* Remove selected attendees button */}
          <button onClick={removeAttendees} style={styles.removeButton}>
            Add Attendee(s)
          </button>

          {/* Remove selected attendees button */}
          <button onClick={removeAttendees} style={styles.removeButton}>
            Add from file
          </button>
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
    color: '#0B2853',
    fontSize: '16px',
    fontWeight: '600',
    marginRight: '425px',
    marginLeft:'-443px' // Adjusts spacing between back button and title
  },
  title1: {
    fontSize: '24px',
    color: '#0B2853',
    fontWeight: '600',
    marginTop: '25px',
    marginBottom: '10px',
  },
  title2: {
    fontSize: '24px',
    color: '#0B2853',
    fontWeight: '600',
    marginTop: '25px',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  filterInput: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: 'black',
    flex: '1',
  },
  icon: {
    color: '#0A306E',
    fontSize: '20px',
  },
  clearButton: {
    backgroundColor: '#fff',
    color: '#0B2853',
    border: '1px solid #0B2853',
    borderRadius: '5px',
    padding: '5px 10px',
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
  attendeeList: {
    maxHeight: '300px',
    overflowY: 'auto',
    width: '100%',
    color: 'black',
    maxWidth: '800px',
    marginBottom: '20px',
  },
  attendeeItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'lightgray',
    marginBottom: '5px',
    borderRadius: '4px',
  },
  checkbox: {
    marginRight: '10px',
  },
  removeButton: {
    padding: '5px 10px',
    color: 'white',
    backgroundColor: '#0A306E',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
};

export default ManageAttendees;