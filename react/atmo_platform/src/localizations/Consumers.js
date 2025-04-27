import LocalizedStrings from 'react-localization';

let consumer_strings = new LocalizedStrings({
  gr: {
    error_server: "Σφάλμα εξυπηρετητή: ",
    error_nodata: "Σφάλμα ανάκτησης δεδομένων: ",
    loading: "Φόρτωση δεδομένων...",
  },
  en: {
    error_server: "Server Error: ",
    error_nodata: "Error on data retrieval: ",
    loading: "Retrieving data...",
  }
});

export default consumer_strings;