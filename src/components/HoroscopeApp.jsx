import React, { useState } from 'react';

const HoroscopeApp = () => {
    const [horoscope, setHoroscope] = useState("");
    const [sign, setSign] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("");

    // Array of zodiac signs
    const zodiacSigns = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];

    const apiKey = "f1rCSIgq931mbp3Q2lYt86soc1NkecT33u5Muvgn"; // Your API key

    const fetchHoroscope = () => {
        const [year, month, date] = birthDate.split("-");
        const [hours, minutes] = birthTime.split(":");

        const requestData = {
            year: parseInt(year),
            month: parseInt(month),
            date: parseInt(date),
            hours: parseInt(hours),
            minutes: parseInt(minutes),
            seconds: 0,
            latitude: 18.933,
            longitude: 72.8166,
            timezone: 5.5,
            config: {
                observation_point: "topocentric",
                ayanamsha: "lahiri"
            }
        };

        fetch("https://json.apiastro.com/planets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            const formattedData = Object.keys(data.output[0]).map(key => {
                const planet = data.output[0][key];
                return `${planet.name}: Current Sign: ${planet.current_sign}, Full Degree: ${planet.fullDegree}, Is Retro: ${planet.isRetro}`;
            }).join("\n");

            setHoroscope(formattedData);
        })
        .catch(error => {
            console.error("Error fetching horoscope:", error);
            setHoroscope("Error fetching horoscope. Please try again.");
        });
    };

    return (
        <div>
            <h1>Horoscope Application</h1>
            <label>
                Select your sign:
                <select value={sign} onChange={(e) => setSign(e.target.value)}>
                    <option value="">e.g., Gemini</option>
                    {zodiacSigns.map((signName) => (
                        <option key={signName} value={signName}>
                            {signName}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Date of Birth (YYYY-MM-DD):
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                />
            </label>
            <br />
            <label>
                Time of Birth (HH:MM):
                <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                />
            </label>
            <br />
            <button onClick={fetchHoroscope}>Get Horoscope</button>
            <pre>{horoscope}</pre>
        </div>
    );
};

export default HoroscopeApp;
