
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

// TODO: REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyGHnnn6GiKYCbMgraKofdbhU8ZaVMBav89Y-xKu63OLp5z-y4O1F9eDhGQ4I9Qn9do/exec";

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.querySelector('.booking-form');
    const bookingWrapper = document.getElementById('booking-wrapper');
    const successMessage = document.getElementById('success-message');

    if (bookingForm) {
        // Validation Helper
        const showError = (input, show) => {
            const errorMsg = input.parentElement.querySelector('.error-msg');
            if (errorMsg) {
                errorMsg.style.display = show ? 'block' : 'none';
            }
            if (show) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        };

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Validation
            let isValid = true;

            // Name
            const fullname = document.getElementById('fullname');
            if (fullname.value.trim() === '') {
                showError(fullname, true);
                isValid = false;
            } else {
                showError(fullname, false);
            }

            // Mobile (Strict 10 digits)
            const mobile = document.getElementById('mobile');
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(mobile.value)) {
                showError(mobile, true);
                isValid = false;
            } else {
                showError(mobile, false);
            }

            // Village
            const village = document.getElementById('village');
            if (village.value.trim() === '') {
                showError(village, true);
                isValid = false;
            } else {
                showError(village, false);
            }

            // Crop
            const crop = document.getElementById('crop');
            if (crop.value.trim() === '') {
                showError(crop, true);
                isValid = false;
            } else {
                showError(crop, false);
            }

            // Acres
            const acres = document.getElementById('acres');
            if (!acres.value || acres.value <= 0) {
                showError(acres, true);
                isValid = false;
            } else {
                showError(acres, false);
            }

            if (!isValid) return;

            // 2. Submission
            const submitBtn = bookingForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Processing...";

            // Get form values
            const formData = {
                fullname: fullname.value,
                mobile: mobile.value,
                village: village.value,
                crop: crop.value,
                acres: acres.value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'new'
            };

            try {
                // Add to Firebase
                await db.collection("bookings").add(formData);

                // Send to Google Sheets (if URL is valid)
                if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes("REPLACE THIS")) {
                    const sheetData = {
                        fullname: formData.fullname,
                        mobile: formData.mobile,
                        village: formData.village,
                        crop: formData.crop,
                        acres: formData.acres
                    };

                    // Fire and forget (optional)
                    fetch(GOOGLE_SCRIPT_URL, {
                        method: "POST",
                        mode: "no-cors",
                        headers: { "Content-Type": "text/plain" },
                        body: JSON.stringify(sheetData)
                    }).catch(err => console.log("Sheet Error (ignored):", err));
                }

                // Show Success UI
                if (bookingWrapper && successMessage) {
                    bookingWrapper.style.display = 'none';
                    successMessage.style.display = 'block';
                } else {
                    alert("Booking Successful!");
                    bookingForm.reset();
                }

            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Error submitting booking. Please try again.\nDetails: " + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });

        // Real-time validation removal on input
        bookingForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                showError(input, false);
            });
        });
    }
});
