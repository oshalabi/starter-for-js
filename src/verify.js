import './index.css';
import theme from './theme.json';

window.addEventListener("DOMContentLoaded", () => {
    const statusText = document.getElementById("status-text");
    const subStatusText = document.getElementById("sub-status-text");
    const spinner = document.getElementById("spinner");
    const successIcon = document.getElementById("success-icon");
    const errorIcon = document.getElementById("error-icon");
    const yearElement = document.getElementById("current-year");
    const manualRedirectContainer = document.getElementById("manual-redirect-container");
    const manualRedirectBtn = document.getElementById("manual-redirect-btn");

    // Dynamic Year Update from Theme (or System)
    if (yearElement) {
        // Option 1: Use theme year if prefered
        yearElement.textContent = theme.branding.year;
        // Option 2: Use actual current year
        // yearElement.textContent = new Date().getFullYear();
    }

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");

    logToTerminal(`Verifying: userId=${userId}, secret=${secret}`);

    if (userId && secret) {
        // Verification Logic
        // Simulate a slight delay for better UX (or real API call)
        setTimeout(() => {
            const deepLink = import.meta.env.VITE_APP_DEEP_LINK;
            // Ensure proper URL construction for deep link
            const redirectUrl = deepLink.includes('?')
                ? `${deepLink}&userId=${userId}&secret=${secret}`
                : `${deepLink}?userId=${userId}&secret=${secret}`;

            showSuccess(redirectUrl);

            // Attempt automatic redirect after a short delay
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000); // Wait 1 second before redirecting
        }, 1500);

    } else {
        showError("Invalid Link", "Use the link sent to your email.");
    }

    function showSuccess(url) {
        if (spinner) {
            spinner.classList.add("opacity-0");
            setTimeout(() => { spinner.style.display = 'none'; }, 300);
        }

        if (successIcon) {
            successIcon.classList.remove("hidden");
            // Trigger reflow
            void successIcon.offsetWidth;
            successIcon.classList.remove("scale-0");
            successIcon.classList.add("scale-100");
        }

        if (statusText) {
            statusText.textContent = "Email Verified!";
            statusText.className = "text-xl font-bold text-gray-900";
        }
        if (subStatusText) subStatusText.textContent = "Redirecting you to the app...";

        // Show Manual Redirect Button
        if (manualRedirectContainer && manualRedirectBtn) {
            manualRedirectBtn.href = url;
            manualRedirectContainer.classList.remove("hidden");
            // Add a slight animation could go here
        }
    }

    function showError(title, message) {
        if (spinner) {
            spinner.classList.add("opacity-0");
            setTimeout(() => { spinner.style.display = 'none'; }, 300);
        }

        if (errorIcon) {
            errorIcon.classList.remove("hidden");
            void errorIcon.offsetWidth;
            errorIcon.classList.remove("scale-0");
            errorIcon.classList.add("scale-100");
        }

        if (statusText) {
            statusText.textContent = title;
            statusText.className = "text-xl font-bold text-red-600";
        }
        if (subStatusText) subStatusText.textContent = message;
    }
});

function logToTerminal(data) {
    const logEndpoint = import.meta.env.VITE_LOG_ENDPOINT;
    if (!logEndpoint) return;

    fetch(logEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log: data }),
    })
        .catch((err) => {
            console.error("❌ Failed to send log to terminal:", err);
        });
}