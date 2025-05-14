import LocalizedStrings from 'react-localization';

let optimization_strings = new LocalizedStrings({
  gr: {
    title: "Σύστημα Βελτιστοποίησης",
    csv_input: "Χειροκίνητη Ανάλυση CSV",
    csv_input_label: "Αρχείο CSV",
    submit: "Εκτέλεση",
    submitting: "Εκτέλεση...",
    json_input: "Ανάλυση Αυτοματοποιημένου JSON",
    json_input_label: "Δεδομένα Αυτοματοποιημένου Συστήματος",
    history: "Τελευταίο αποτέλεσμα",
    error_plan_creation: "Σφάλμα δημιουργίας πλάνων: ",
    error_server: "Σφάλμα εξυπηρετητή: ",
    error_nodata: "Δεν βρέθηκε αρχείο ή JSON δεδομένα!",
    error_gui: "Άγνωστο σφάλμα πλατφόρμας, δοκιμάστε ανανέωση σελίδας.",
    model_selector: "Επιλογή μοντέλου",
    result_modal: "Βελτιστοποιημένα πλάνα",
    pdf_download: "Λήψη PDF αναφοράς",
    csv_download: "Λήψη CSV αναφοράς",
    json_download: "Λήψη JSON αναφοράς",
  },
  en: {
    title: "Optimization System",
    csv_input: "Manual CSV Analysis",
    csv_input_label: "CSV File",
    submit: "Execute",
    submitting: "Executing...",
    json_input: "Automated JSON Analysis",
    json_input_label: "Automated System Data",
    history: "Last result",
    error_plan_creation: "Error creating plans: ",
    error_server: "Server Error: ",
    error_nodata: "No CSV or JSON data found!",
    error_gui: "Unknown platform error, try page refresh.",
    model_selector: "Select model",
    result_modal: "Optimized plans",
    pdf_download: "PDF report download",
    csv_download: "CSV report download",
    json_download: "JSON report download",
  }
});

export default optimization_strings;