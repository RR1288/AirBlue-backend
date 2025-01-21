import React from 'react';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const EventDetailPage = () => {
    return (
        <div style={styles.page}>
            {/* Header Component */}
            <Header title="AirBlue System" />

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            

            {/* Main Content */}
            <div style={styles.mainContent}>
                {/* Back Button and Title */}
                <div style={styles.headerRow}>
                    <Link to="/manage-events" style={styles.backButton}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
                    </Link>
                    <h1 style={styles.eventTitle}>IEEE Board Meeting 2024</h1>
                </div>

                {/* Form Section */}
                <form style={styles.form}>
                {/* Date Input */}
                <div style={styles.row}>
                    <label style={styles.label}>Date:</label>
                    <input type="date" placeholder="MM/DD/YYYY" style={styles.input} />
                </div>

                    {/* Attendees Link */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Attendees:</label>
                        <a href="/manage-attendees" style={styles.link}>
                            Manage attendees
                        </a>
                    </div>

                    {/* Event Type Dropdown */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Event Type:</label>
                        <select style={styles.select}>
                            <option>Board Meeting</option>
                            <option>Quarter Meeting</option>
                            <option>Conference</option>
                            <option>+ Add Event Type</option>
                        </select>
                    </div>

                    {/* Location Input and Map */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Location:</label>
                        <div style={styles.locationContainer}>
                            <select style={styles.select}>
                                <option>Rochester Conference Center</option>
                                <option>New York Hall</option>
                            </select>
                            <img
                                src="../src/images/map.png"
                                alt="Map Placeholder"
                                style={styles.map}
                            />
                        </div>
                    </div>

                    {/* Budget Section */}
                    <div style={styles.budgetRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Budget per event:</label>
                            <input type="text" defaultValue="$5,000.00" style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Budget per attendee:</label>
                            <input type="text" defaultValue="$400.00" style={styles.input} />
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Notes:</label>
                        <textarea
                            style={styles.textarea}
                            defaultValue="It is a long established fact that a reader will be distracted by the readable content..."
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div style={styles.actionRow}>
                        <button type="button" style={styles.discardButton}>
                            Discard changes
                        </button>
                        <button type="submit" style={styles.saveButton}>
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#FFFFFF',
    },
    mainContent: {
        flex: 1,
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
    },
    headerRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    backButton: {
        textDecoration: 'none',
        color: '#0B2853',
        marginRight: '590px',
        marginLeft: '-610px',
    },
    icon: {
        fontSize: '20px',
    },
    eventTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#0B2853',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
        marginRight: 'auto',
        color: '#0B2853',
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        marginLeft: '40px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#F9F9F9',
        color: 'gray',
    },
    select: {
        padding: '10px',
        color: 'gray',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#F9F9F9',
    },
    locationContainer: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
    },
    map: {
        width: '200px',
        height: '100px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    budgetRow: {
        display: 'flex',
        gap: '20px',
    },
    textarea: {
        padding: '10px',
        backgroundColor: '#F9F9F9',
        color: 'gray',
        borderRadius: '4px',
        border: '1px solid #ccc',
        minHeight: '100px',
    },
    actionRow: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    discardButton: {
        backgroundColor: '#FFFFFF',
        color: '#0B2853',
        border: '1px solid #0B2853',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
    },
    saveButton: {
        backgroundColor: '#0B2853',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
    },
    link: {
        color: '#0B2853',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
};

export default EventDetailPage;
