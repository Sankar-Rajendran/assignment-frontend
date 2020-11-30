import React, { useEffect, useState } from "react";
import Table from "./Table";
import { API_ENDPOINT } from "../config";
import BillingComponent from "./BillingComponent";
import "./Styles.scss";

function ViewAppointments({ showAppointmentForm }) {
    const searchParam = {
        billingStatus: "notBilled"
    };

    const [appointments, setAppointments] = useState([]);
    const [showBilling, setShowBilling] = useState(false);
    const [billingId, setBillingId] = useState(null);
    const [billingFilter, setBillingFilter] = useState("notBilled");

    useEffect(() => {
        !showBilling && fetchAppointments();
    }, [showAppointmentForm, showBilling]);

    const fetchAppointments = async () => {
        try {
            searchParam.billingStatus = billingFilter;
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ searchParam: searchParam })
            };
            const response = await fetch(
                `${API_ENDPOINT}appointments`,
                requestOptions
            );
            const appointments = await response.json();
            setAppointments(appointments);
        } catch (error) {
            alert("Something went wrong, Try again");
        }
    };

    const handleChange = (event) => {
        searchParam[event.target.name] = event.target.value;
        if (event.target.name === "billingStatus") {
            setBillingFilter(event.target.value);
        }
    };

    const showBillingPage = (billingId) => {
        setBillingId(billingId);
        setShowBilling(true);
    };

    const searchHandler = () => {
        fetchAppointments();
    };

    const toggleBillingView = () => {
        setShowBilling(false);
    };

    return (
        <div>
            {showBilling ? (
                <BillingComponent
                    billingId={billingId}
                    toggleBillingView={toggleBillingView}
                />
            ) : (
                <div className="view-appointments">
                    <p className="title">View Appointments</p>
                    <hr></hr>
                    <div className="flex-display center-align space-evenly mb-20">
                        <div>
                            <label>From Date</label>
                            <input
                                onChange={handleChange}
                                type="date"
                                className="form-control ml-20"
                                name="fromDate"
                            />
                        </div>
                        <div>
                            <label>To Date</label>
                            <input
                                onChange={handleChange}
                                type="date"
                                className="form-control ml-20"
                                name="toDate"
                            />
                        </div>
                        <div>
                            <label>Status</label>
                            <select
                                value={billingFilter}
                                name="billingStatus"
                                onChange={handleChange}
                                className="ml-20"
                            >
                                <option value="notBilled">
                                    Not Yet Billed
                                </option>
                                <option value="dueBilled">Due Billed</option>
                                <option value="fullyPaid">Fully-Paid</option>
                            </select>
                        </div>
                        <div className="flex-display">
                            <label className="mt-10">Common Search</label>
                            <input
                                name="searchText"
                                onChange={handleChange}
                                type="text"
                                className="form-control ml-20"
                            />
                            <button
                                onClick={searchHandler}
                                className="secondary-btn mt-10 search-btn ml-20"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <Table
                        columns={[
                            "Patient Name",
                            "Age-Gender",
                            "Appointment Date",
                            "Balance Amount",
                            "Action"
                        ]}
                        component="appointments"
                        rows={appointments}
                        callback={showBillingPage}
                    />
                </div>
            )}
        </div>
    );
}

export default ViewAppointments;
