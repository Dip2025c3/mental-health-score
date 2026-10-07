// ==========================================
// MindScore AI
// Final Frontend JavaScript
// ==========================================


// ==========================================
// API URL
// ==========================================

const API_URL = "https://mental-health-score-2-hpho.onrender.com/predict";


// ==========================================
// HTML Elements
// ==========================================

const form = document.getElementById("predictionForm");

const predictBtn =
    document.getElementById("predictBtn");

const btnText =
    document.getElementById("btnText");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");

const errorBox =
    document.getElementById("error");

const scoreElement =
    document.getElementById("score");

const messageElement =
    document.getElementById("message");

const progressCircle =
    document.getElementById("progressCircle");


// ==========================================
// FORM SUBMIT
// ==========================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Hide previous result/error
    result.classList.remove("show");
    errorBox.classList.remove("show");


    // Show loading
    loading.classList.add("show");

    predictBtn.disabled = true;

    btnText.textContent = "Analyzing...";


    // ==========================================
    // Collect Form Data
    // ==========================================

    const data = {

        age: Number(
            document.getElementById("age").value
        ),

        gender:
            document.getElementById("gender").value,

        country:
            document.getElementById("country").value,

        academic_level:
            document.getElementById("academic_level").value,

        most_used_platform:
            document.getElementById(
                "most_used_platform"
            ).value,

        purpose_of_use:
            document.getElementById(
                "purpose_of_use"
            ).value,

        avg_daily_usage_hours: Number(
            document.getElementById(
                "avg_daily_usage_hours"
            ).value
        ),

        daily_unlocks: Number(
            document.getElementById(
                "daily_unlocks"
            ).value
        ),

        study_hours: Number(
            document.getElementById(
                "study_hours"
            ).value
        ),

        physical_activity_hours: Number(
            document.getElementById(
                "physical_activity_hours"
            ).value
        ),

        sleep_hours_per_night: Number(
            document.getElementById(
                "sleep_hours_per_night"
            ).value
        ),

        stress_level:
            document.getElementById(
                "stress_level"
            ).value
    };


    console.log(
        "Sending data:",
        data
    );


    try {

        // ==========================================
        // SEND DATA TO FASTAPI
        // ==========================================

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        // ==========================================
        // READ RESPONSE
        // ==========================================

        const responseData =
            await response.json();


        console.log(
            "FastAPI response:",
            responseData
        );


        // ==========================================
        // HANDLE ERROR
        // ==========================================

        if (!response.ok) {

            let message =
                "Prediction failed.";

            if (responseData.detail) {

                if (
                    Array.isArray(
                        responseData.detail
                    )
                ) {

                    message =
                        responseData.detail
                            .map(item => {

                                const field =
                                    item.loc
                                        ? item.loc[
                                            item.loc.length - 1
                                        ]
                                        : "field";

                                return (
                                    field +
                                    ": " +
                                    item.msg
                                );
                            })
                            .join(" | ");

                } else {

                    message =
                        String(
                            responseData.detail
                        );
                }
            }

            throw new Error(message);
        }


        // ==========================================
        // GET EXACT BACKEND SCORE
        // ==========================================

        const score =
            Number(
                responseData
                    .predicted_mental_health_score
            );


        console.log(
            "Predicted score:",
            score
        );


        // ==========================================
        // CHECK SCORE
        // ==========================================

        if (!Number.isFinite(score)) {

            throw new Error(
                "Invalid prediction received from FastAPI."
            );
        }


        // ==========================================
        // SHOW RESULT
        // ==========================================

        showResult(score);


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );

        showError(
            error.message
        );


    } finally {

        // ==========================================
        // RESET BUTTON
        // ==========================================

        loading.classList.remove("show");

        predictBtn.disabled = false;

        btnText.textContent =
            "Predict My Score";
    }

});


// ==========================================
// SHOW RESULT
// ==========================================

function showResult(score) {

    score = Number(score);


    // Round to 2 decimals
    score =
        Math.round(score * 100) / 100;


    // Show result card
    result.classList.add("show");


    // Animate number
    animateScore(score);


    // Animate circle
    animateCircle(score);


    // Message
    messageElement.textContent =
        getScoreMessage(score);


    // Scroll to result
    setTimeout(() => {

        result.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 150);
}


// ==========================================
// SCORE NUMBER ANIMATION
// ==========================================

function animateScore(target) {

    const duration = 1200;

    const start =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - start;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        // Smooth easing
        const ease =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const current =
            target * ease;


        scoreElement.textContent =
            current.toFixed(1);


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        } else {

            scoreElement.textContent =
                target.toFixed(2);
        }
    }


    requestAnimationFrame(update);
}


// ==========================================
// SCORE CIRCLE
// ==========================================

function animateCircle(score) {

    if (!progressCircle) {
        return;
    }


    const radius = 90;

    const circumference =
        2 * Math.PI * radius;


    progressCircle.style.strokeDasharray =
        circumference;


    progressCircle.style.strokeDashoffset =
        circumference;


    // Score assumed to be 0 - 10
    const percentage =
        Math.max(
            0,
            Math.min(
                score / 10,
                1
            )
        );


    const offset =
        circumference *
        (1 - percentage);


    setTimeout(() => {

        progressCircle.style.strokeDashoffset =
            offset;

    }, 100);
}


// ==========================================
// SCORE MESSAGE
// ==========================================

function getScoreMessage(score) {

    if (score >= 8) {

        return (
            "Excellent mental health score! " +
            "Keep maintaining your healthy habits."
        );
    }


    if (score >= 6) {

        return (
            "Good mental health score. " +
            "Keep balancing your study, sleep " +
            "and daily activities."
        );
    }


    if (score >= 4) {

        return (
            "Your score is moderate. " +
            "Try maintaining a healthy balance " +
            "between study, sleep and activities."
        );
    }


    return (
        "Your score is relatively low. " +
        "Consider improving your sleep, " +
        "activity and daily routine."
    );
}


// ==========================================
// ERROR
// ==========================================

function showError(message) {

    errorBox.textContent =
        "⚠️ " + message;

    errorBox.classList.add("show");
}

