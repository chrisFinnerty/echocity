const getDomainName = (url) => {

    // helper function get domain/hostname
    const helperFunc = (url) => {
      try{
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, '');
      } catch(err){
        console.error(err);
      }
    }
    const domainName = helperFunc(url).split('.')[0];
    const displayName = domainName.charAt(0).toUpperCase() + domainName.slice(1);

    return displayName;
  }

export default getDomainName;