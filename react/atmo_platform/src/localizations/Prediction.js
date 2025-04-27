import LocalizedStrings from 'react-localization';

let prediction_strings = new LocalizedStrings({
  gr: {
    title: "Μοντέλο Πρόβλεψης",
    csv_input: "Ανάλυση αρχείου CSV",
    csv_input_label: "Αρχείο CSV",
    submit: "Εκτέλεση",
    submitting: "Εκτέλεση...",
    json_input: "Ανάλυση JSON",
    json_input_label: "Δεδομένα JSON",
    history: "Τελευταίο αποτέλεσμα",
    error_server: "Σφάλμα εξυπηρετητή: ",
    error_nodata: "Δεν βρέθηκε αρχείο ή JSON δεδομένα!",
    error_gui: "Άγνωστο σφάλμα πλατφόρμας, δοκιμάστε ανανέωση σελίδας.",
    result_modal: "Αποτελέσματα πρόβλεψης",
    pdf_download: "Λήψη PDF αναφοράς",
    csv_download: "Λήψη CSV αναφοράς",
    json_download: "Λήψη JSON αναφοράς",
  },
  en: {
    title: "Predictive Model",
    csv_input: "CSV File Analysis",
    csv_input_label: "CSV File",
    submit: "Execute",
    submitting: "Executing...",
    json_input: "JSON Analysis",
    json_input_label: "JSON Data",
    history: "Last result",
    error_server: "Server Error: ",
    error_nodata: "No CSV or JSON data found!",
    error_gui: "Unknown platform error, try page refresh.",
    result_modal: "Prediction results",
    pdf_download: "PDF report download",
    csv_download: "CSV report download",
    json_download: "JSON report download",
  }
});

export default prediction_strings;