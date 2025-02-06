// Helper to format ISO date strings
const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    
    // Split the ISO string (e.g., "2025-02-07T08:00:00.000Z")
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${month}-${day}-${year}`; // Output: "02-07-2025"
  };

export default formatDate;