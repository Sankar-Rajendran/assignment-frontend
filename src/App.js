import React, { useState } from "react";
import AppointmentForm from "./components/AppointmentForm";
import ViewAppointments from "./components/ViewAppointments";
import "./App.scss";

function App() {
    const [showAppointmentForm, setShowAppointmentForm] = useState(true);

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={() => setShowAppointmentForm(true)}>
                    Add New Appointment
                </button>
                <button onClick={() => setShowAppointmentForm(false)}>
                    Check Appointments
                </button>
                {showAppointmentForm ? (
                    <AppointmentForm
                        setShowAppointmentForm={setShowAppointmentForm}
                    />
                ) : (
                    <ViewAppointments
                        showAppointmentForm={showAppointmentForm}
                    />
                )}
            </header>
        </div>
    );
}

export default App;
