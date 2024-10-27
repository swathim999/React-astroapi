import React, { useState } from 'react';

const HoroscopeApp = () => {
    const [horoscopeData, setHoroscopeData] = useState(null);
    const [dob, setDob] = useState('');
    const [time, setTime] = useState('');
    const [sign, setSign] = useState('');

    const zodiacSigns = [
        { name: 'Aries', value: 1 },
        { name: 'Taurus', value: 2 },
        { name: 'Gemini', value: 3 },
        { name: 'Cancer', value: 4 },
        { name: 'Leo', value: 5 },
        { name: 'Virgo', value: 6 },
        { name: 'Libra', value: 7 },
        { name: 'Scorpio', value: 8 },
        { name: 'Sagittarius', value: 9 },
        { name: 'Capricorn', value: 10 },
        { name: 'Aquarius', value: 11 },
        { name: 'Pisces', value: 12 },
    ];

    const fetchHoroscope = async () => {
        // Check for empty inputs
        if (!dob || !time || !sign) {
            alert('Please fill in all fields.');
            return;
        }

        console.log('Fetching horoscope for:', {
            year: new Date(dob).getFullYear(),
            month: new Date(dob).getMonth() + 1,
            date: new Date(dob).getDate(),
            hours: new Date(`1970-01-01T${time}:00`).getHours(),
            minutes: new Date(`1970-01-01T${time}:00`).getMinutes(),
            sign,
        });

        try {
            const response = await fetch('https://json.apiastro.com/planets', {
                method: 'POST',
                headers: {
                    'x-api-key': 'f1rCSIgq931mbp3Q2lYt86soc1NkecT33u5Muvgn',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    year: new Date(dob).getFullYear(),
                    month: new Date(dob).getMonth() + 1,
                    date: new Date(dob).getDate(),
                    hours: new Date(`1970-01-01T${time}:00`).getHours(),
                    minutes: new Date(`1970-01-01T${time}:00`).getMinutes(),
                    latitude: 18.933,
                    longitude: 72.8166,
                    timezone: 5.5,
                    config: {
                        observation_point: "topocentric",
                        ayanamsha: "lahiri"
                    }
                }),
            });

            if (!response.ok) {
                console.error('Response error:', response.statusText);
                alert('Failed to fetch horoscope data. Please try again.');
                return;
            }

            const data = await response.json();
            console.log('Fetched horoscope data:', data); // Log the response for debugging

            if (data.output && data.output.length > 1) {
                setHoroscopeData(data.output[1]); // Access the second object in the output
            } else {
                console.error('Unexpected API response structure:', data);
                setHoroscopeData(null); // Reset if the structure is not as expected
            }
        } catch (error) {
            console.error('Error fetching horoscope data:', error);
            alert('An error occurred while fetching data. Please check the console for more details.');
        }
    };

    // Reset function to clear inputs and horoscope data
    const resetForm = () => {
        setHoroscopeData(null);
        setDob('');
        setTime('');
        setSign('');
    };

    return (
        <div className="horoscope-container">
            <h1>Horoscope Application</h1>
            <label htmlFor="signs">Select your sign:</label>
            <select id="signs" value={sign} onChange={(e) => setSign(e.target.value)}>
                <option value="">Select Sign</option>
                {zodiacSigns.map(({ name, value }) => (
                    <option key={value} value={value}>{name}</option>
                ))}
            </select>

            <label htmlFor="dob">Date of Birth (YYYY-MM-DD):</label>
            <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
            />

            <label htmlFor="time">Time of Birth (HH:MM):</label>
            <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />

            <button onClick={fetchHoroscope}>Get Horoscope</button>

            <div className="output" id="horoscopeOutput">
                {horoscopeData && (
                    <div>
                        {Object.entries(horoscopeData).map(([key, planet], index) => (
                            <div key={index}>
                                <strong>{key}:</strong> Current Sign: {planet.current_sign}, Full Degree: {planet.fullDegree}, Is Retro: {planet.isRetro ? 'true' : 'false'}
                            </div>
                        ))}
                    </div>
                )}
                {!horoscopeData && <p>No horoscope data available.</p>}
            </div>

            {/* Reset Button */}
            <button onClick={resetForm} style={{ marginTop: '20px' }}>Reset</button>
        </div>
    );
};

export default HoroscopeApp;
