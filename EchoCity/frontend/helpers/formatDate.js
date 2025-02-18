// Helper to format ISO date strings
const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    
    // Split the ISO string (e.g., "2025-02-07T08:00:00.000Z")
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${month}-${day}-${year}`; // Output: "02-07-2025"
  };

  const formatDateHeaders = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateMY = (date) => {
    const isoDate = date.includes('T') ? date : date.replace(' ', 'T');
    
    return new Date(isoDate).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

export {
  formatDate,
  formatDateHeaders,
  formatDateMY
};