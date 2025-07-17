import { account } from "../lib/appwrite";

window.addEventListener("DOMContentLoaded", () => {
    const status = document.getElementById("status");

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");

    logToTerminal(`Verifying: userId=${userId}, secret=${secret}`);

    if (!status) {
        console.error("Status element not found in DOM.");
        return;
    }

    if (userId && secret) {
        account
            .updateVerification(userId, secret)
            .then(() => {
                status.innerText = "Email verified! Redirecting to app...";
                setTimeout(() => {
                    window.location.href = `myapp://verify?verified=true`;
                }, 2000);
            })
            .catch((err) => {
                logToTerminal(`Verification failed=${err}`);
                console.error("Verification failed", err);
                window.location.href = `myapp://verify?verified=false`;
            });
    } else {
        status.innerText = "Missing verification parameters.";
    }
});

function logToTerminal(data) {
    fetch("http://10.0.2.2:3000/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log: data }),
    })
        .then((res) => {
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            console.log("✅ Sent to terminal:", data);
        })
        .catch((err) => {
            console.error("❌ Failed to send log to terminal:", err);
        });
}