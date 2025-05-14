import LocalizedStrings from 'react-localization';

let prediction_strings = new LocalizedStrings({
  gr: {
    title: "Μοντέλο Πρόβλεψης",
    csv_input: "Χειροκίνητη Ανάλυση CSV",
    csv_input_label: "Αρχείο CSV",
    submit: "Εκτέλεση",
    submitting: "Εκτέλεση...",
    json_input: "Ανάλυση Αυτοματοποιημένου JSON",
    json_input_label: "Δεδομένα Αυτοματοποιημένου Συστήματος",
    history: "Τελευταίο αποτέλεσμα",
    error_server: "Σφάλμα εξυπηρετητή: ",
    error_nodata: "Δεν βρέθηκε αρχείο ή JSON δεδομένα!",
    error_gui: "Άγνωστο σφάλμα πλατφόρμας, δοκιμάστε ανανέωση σελίδας.",
    result_modal: "Αποτελέσματα πρόβλεψης",
    pdf_download: "Λήψη PDF αναφοράς",
    csv_download: "Λήψη CSV αναφοράς",
    json_download: "Λήψη JSON αναφοράς",
    atm_due: "Άμεσος εφοδιασμός",
    atm_not_due: "Επάρκεια αποθέματος",
    atm_missing: "Ανεπάρκεια δεδομένων εκπαίδευσης",
  },
  en: {
    title: "Predictive Model",
    csv_input: "Manual CSV Analysis",
    csv_input_label: "CSV File",
    submit: "Execute",
    submitting: "Executing...",
    json_input: "Automated JSON Analysis",
    json_input_label: "Automated System Data",
    history: "Last result",
    error_server: "Server Error: ",
    error_nodata: "No CSV or JSON data found!",
    error_gui: "Unknown platform error, try page refresh.",
    result_modal: "Prediction results",
    pdf_download: "PDF report download",
    csv_download: "CSV report download",
    json_download: "JSON report download",
    atm_due: "Supply needed",
    atm_not_due: "Enough supply",
    atm_missing: "Not enough training data",
  }
});

export default prediction_strings;