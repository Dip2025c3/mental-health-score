const API_URL =
    "http://127.0.0.1:8000/predict";


const form =
    document.getElementById("predictionForm");

const predictBtn =
    document.getElementById("predictBtn");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");

const errorBox =
    document.getElementById("error");

const score =
    document.getElementById("score");

const message =
    document.getElementById("message");


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        result.classList.add("hidden");

        errorBox.classList.add("hidden");

        loading.classList.remove("hidden");

        predictBtn.disabled = true;


        const data = {

            age: Number(
                document.getElementById("age").value
            ),

            gender:
                document.getElementById("gender").value,

            country:
                document.getElementById("country").value,

            academic_level:
                document.getElementById(
                    "academic_level"
                ).value,

            most_used_platform:
                document.getElementById(
                    "most_used_platform"
                ).value,

            purpose_of_use:
                document.getElementById(
                    "purpose_of_use"
                ).value,

            avg_daily_usage_hours:
                Number(
                    document.getElementById(
                        "avg_daily_usage_hours"
                    ).value
                ),

            daily_unlocks:
                Number(
                    document.getElementById(
                        "daily_unlocks"
                    ).value
                ),

            study_hours:
                Number(
                    document.getElementById(
                        "study_hours"
                    ).value
                ),

            physical_activity_hours:
                Number(
                    document.getElementById(
                        "physical_activity_hours"
                    ).value
                ),

            sleep_hours_per_night:
                Number(
                    document.getElementById(
                        "sleep_hours_per_night"
                    ).value
                ),

            stress_level:
                document.getElementById(
                    "stress_level"
                ).value
        };


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            const responseData =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    JSON.stringify(
                        responseData.detail
                    )
                );
            }


            const predictedScore =
                responseData
                .predicted_mental_health_score;


            score.textContent =
                Number(predictedScore)
                .toFixed(2);


            if (predictedScore >= 70) {

                message.textContent =
                    "Higher predicted mental health score.";

            }

            else if (predictedScore >= 40) {

                message.textContent =
                    "Moderate predicted mental health score.";

            }

            else {

                message.textContent =
                    "Lower predicted mental health score.";
            }


            result.classList.remove("hidden");

        }


        catch (error) {

            errorBox.textContent =
                "Error: " +
                error.message +
                " Make sure FastAPI is running.";

            errorBox.classList.remove(
                "hidden"
            );
        }


        finally {

            loading.classList.add(
                "hidden"
            );

            predictBtn.disabled =
                false;
        }

    }
);