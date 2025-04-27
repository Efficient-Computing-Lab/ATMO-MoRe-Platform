import LocalizedStrings from 'react-localization';

let data_manager_strings = new LocalizedStrings({
  gr: {
    title: "Διαχειριστής Δεδομένων",
    data_refresh_title: "Ενημέρωση Βάσης",
    refresh_data: "Ενημέρωση",
    refresh_data_loading: "Ενημέρωση...",
    dataset_upload_title: "Υποβολή Νέων Δεδομένων",
    dataset_upload: "Αρχείο Δεδομένων (zip)",
    dataset_upload_submit: "Υποβολή",
    result_modal: "Αποτελέσματα ανανέωσης",
  },
  en: {
    title: "Data Manager",
    data_refresh_title: "Database Update",
    refresh_data: "Update Data",
    refresh_data_loading: "Updating...",
    dataset_upload_title: "Upload New Data",
    dataset_upload: "Dataset File (zip)",
    dataset_upload_submit: "Submit",
    result_modal: "Dataset refresh report",
  }
});

export default data_manager_strings;