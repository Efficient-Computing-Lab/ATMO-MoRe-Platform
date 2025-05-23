import LocalizedStrings from 'react-localization';

let security_strings = new LocalizedStrings({
  gr: {
    login_title: "Σύνδεση Χρήστη",
    username: "Όνομα Χρήστη",
    password: "Κωδικός",
    login_button: "Σύνδεση",
    logging_in: "Σύνδεση...",
    login_success: "Επιτυχής σύνδεση!",
    login_failed: "Η σύνδεση απέτυχε",
    error_server: "Σφάλμα εξυπηρετητή: ",
    register_title: "Εγγραφή Χρήστη",
    confirm_password: "Επιβεβαίωση Κωδικού",
    register_button: "Εγγραφή",
    registering: "Εγγραφή...",
    register_success: "Επιτυχής εγγραφή!",
    register_failed: "Η εγγραφή απέτυχε",
    passwords_do_not_match: "Οι κωδικοί δεν ταιριάζουν",
    logout_title: "Αποσύνδεση Χρήστη",
    logout_button: "Αποσύνδεση",
    logging_out: "Αποσύνδεση...",
    logout_success: "Αποσυνδεθήκατε με επιτυχία",
    logout_failed: "Η αποσύνδεση απέτυχε",
    session_expired: "Η συνεδρία σας έληξε, παρακαλώ συνδεθείτε ξανά",
    unauthorized: "Μη εξουσιοδοτημένη πρόσβαση",
  },
  en: {
    login_title: "User Login",
    username: "Username",
    password: "Password",
    login_button: "Login",
    logging_in: "Logging in...",
    login_success: "Login successful!",
    login_failed: "Login failed",
    error_server: "Server Error: ",
    register_title: "User Registration",
    confirm_password: "Confirm Password",
    register_button: "Register",
    registering: "Registering...",
    register_success: "Registration successful!",
    register_failed: "Registration failed",
    passwords_do_not_match: "Passwords do not match",
    logout_title: "User logout",
    logout_button: "Logout",
    logging_out: "Logging out...",
    logout_success: "Successfully logged out",
    logout_failed: "Loggout failed",
    session_expired: "Your session has expired, please log in again",
    unauthorized: "Unauthorized access",
  }
});

export default security_strings;
