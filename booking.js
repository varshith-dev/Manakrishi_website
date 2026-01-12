
// Firebase Configuration (Compat)
const firebaseConfig = {
    apiKey: "AIzaSyBy2yNoxRWj0fR5_3zXWZoi7xwrusHBf9U",
    authDomain: "manakrishi-booking.firebaseapp.com",
    projectId: "manakrishi-booking",
    storageBucket: "manakrishi-booking.firebasestorage.app",
    messagingSenderId: "658175860538",
    appId: "1:658175860538:web:a570816454f7d7697cfa03",
    measurementId: "G-246CVYV263"
};

// Initialize Firebase (Compat)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize Firestore
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.querySelector('.booking-form');
    // Remove the inline onsubmit
    if (bookingForm) {
        bookingForm.removeAttribute('onsubmit');

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Processing...";

            // Get form values
            const formData = {
                fullname: document.getElementById('fullname').value,
                mobile: document.getElementById('mobile').value,
                village: document.getElementById('village').value,
                crop: document.getElementById('crop').value,
                acres: document.getElementById('acres').value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Compat timestamp
                status: 'new'
            };

            try {
                // Add a new document using Compat syntax
                const docRef = await db.collection("bookings").add(formData);
                console.log("Document written with ID: ", docRef.id);

                // Get success message based on language
                const currentLang = localStorage.getItem('manakrishi_lang') || 'en';
                const successMsg = currentLang === 'te'
                    ? "బుకింగ్ విజయవంతమైంది! మేము త్వరలో మిమ్మల్ని సంప్రదిస్తాము."
                    : "Booking Successful! We will contact you shortly.";

                alert(successMsg);
                bookingForm.reset();
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Error submitting booking: " + error.message + "\n\n(Check your browser console for more details)");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});
