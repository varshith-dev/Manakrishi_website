import { db } from './firebase-init.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.querySelector('.booking-form');
    // Remove the inline onsubmit to prevent conflicts (or handle event.preventDefault correctly here)
    if (bookingForm) {
        bookingForm.removeAttribute('onsubmit'); // We will handle it with addEventListener

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
                timestamp: serverTimestamp(),
                status: 'new' // Initial status for the booking
            };

            try {
                // Add a new document with a generated ID
                const docRef = await addDoc(collection(db, "bookings"), formData);
                console.log("Document written with ID: ", docRef.id);

                // Get success message based on language (optional dynamic check, falling back to English default logic or alert)
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
