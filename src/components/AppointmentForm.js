import React, { useState } from "react";
import { validate } from "../forms/formValidations";
import { API_ENDPOINT } from "../config";
import useForm from "../custom-hooks/useForm";
import Table from "./Table";
import { scanList, userAge, billingStatus } from "../constants";
import "./Styles.scss";

function AppointmentForm({ setShowAppointmentForm }) {
    const [age, setAge] = useState("");
    const [selectedScans, setSelectedScans] = useState([]);
    const [gender, setGender] = useState("Male");
    const [ageRepresentation, setAgeRepresentation] = useState(userAge.years);

    const addAppointment = async () => {
        try {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientDetails: formUserDetails(),
                    billingDetails: formBillingDetails()
                })
            };
            const response = await fetch(
                `${API_ENDPOINT}createappointment`,
                requestOptions
            );
            const message = await response.json();
            if (message.error) {
                alert(message.error);
            } else {
                setShowAppointmentForm(false);
                alert("Appointment created successfully");
            }
        } catch (error) {
            alert("Something went wrong");
        }
    };

    const {
        values,
        errors,
        handleChange,
        setFieldValues,
        handleSubmit
    } = useForm(addAppointment, validate);

    const formUserDetails = () => {
        return {
            patientName: values.patientName,
            gender: gender,
            age: `${age} ${ageRepresentation === "years" ? "Years" : "Months"}`,
            dob: values.dob,
            phoneNo: values.phoneNo,
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2,
            city: values.city,
            state: values.state,
            pincode: values.pincode,
            country: values.country
        };
    };

    const formBillingDetails = () => {
        const total = selectedScans.reduce(
            (totalAmount, scanAmount) =>
                totalAmount + (scanAmount["totalAmount"] || 0),
            0
        );
        return {
            patientName: values.patientName,
            gender: gender,
            age: `${age} ${ageRepresentation === "years" ? "Years" : "Months"}`,
            appointmentDate: values.appointmentDate,
            scanNames: selectedScans.map((x) => x.value).join(","),
            amountPaid: 0,
            noOfTransactions: 0,
            status: billingStatus.notBilled,
            balanceAmount: total,
            totalAmount: total,
            discount: selectedScans.reduce(
                (totalAmount, scanAmount) =>
                    totalAmount + (Number(scanAmount["discount"]) || 0),
                0
            )
        };
    };

    const today = new Date();
    const maxDate = `${today.getFullYear()}-${
        today.getMonth() + 1
    }-${today.getDate()}`;

    const onSalutationChange = (event) => {
        const salutationValue = event.target.value;
        if (salutationValue === "mr") {
            setGender("Male");
        } else {
            setGender("Female");
        }
    };

    const onDOBChange = (event) => {
        if (ageRepresentation === userAge.years) {
            calculateAgeYears(event.target.value);
        } else {
            calculateAgeMonths(event.target.value);
        }
        handleChange(event);
    };

    const ageRepresentChange = (event) => {
        setAgeRepresentation(event.target.value);
    };

    const calculateAgeYears = (dateString) => {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age <= 0) {
            setAgeRepresentation(userAge.months);
            calculateAgeMonths(dateString);
        } else {
            setFieldValues("age", age);
            setAge(age);
        }
    };

    const deleteAddedScan = (index) => {
        const selectedItem = [...selectedScans];
        selectedItem.splice(index, 1);
        setSelectedScans(selectedItem);
    };

    const setScanItem = (values) => {
        const selectedItem = [...selectedScans];
        const index = selectedItem.findIndex((x) => x.name === values.name);
        if (index !== -1) {
            alert("This scan item is already added in the list");
            return;
        }
        selectedItem.push(values);
        setSelectedScans(selectedItem);
    };

    function calculateAgeMonths(dateString) {
        let targetDate = new Date(dateString);
        let months;
        let today = new Date();
        months = (today.getFullYear() - targetDate.getFullYear()) * 12;
        months -= targetDate.getMonth();
        months += today.getMonth();
        months = months <= 0 ? 0 : months;
        if (months > 12) {
            setAgeRepresentation(userAge.years);
            calculateAgeYears(dateString);
        } else {
            setFieldValues("age", months);
            setAge(months);
        }
    }

    return (
        <div className="appointment-form">
            <p className="title">Patient Details</p>
            <hr></hr>
            <form onSubmit={handleSubmit}>
                <div className="flex-display row">
                    <div className="flex-display column-1">
                        <label className="form-label">Patient Name</label>
                        <div>
                            <div className="flex-display">
                                <select onChange={onSalutationChange}>
                                    <option value="mr">Mr</option>
                                    <option value="mrs">Mrs</option>
                                    <option value="ms">Ms</option>
                                </select>
                                <input
                                    name="patientName"
                                    onChange={handleChange}
                                    className={`ml-10 form-control ${
                                        errors.patientName
                                            ? "error-field"
                                            : null
                                    }`}
                                />
                            </div>
                            {errors.patientName && (
                                <p className="error-msg">
                                    {errors.patientName}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex-display ml-30">
                        <label className="form-label">Gender</label>
                        <div>
                            <input
                                checked={gender === "Male"}
                                onChange={() => {}}
                                type="radio"
                                id="male"
                                name="gender"
                                value="Male"
                            />
                            <label htmlFor="male">Male</label>
                            <input
                                checked={gender === "Female"}
                                onChange={() => {}}
                                type="radio"
                                id="female"
                                name="gender"
                                value="Female"
                            />
                            <label htmlFor="female">Female</label>
                        </div>
                    </div>
                </div>
                <div className="flex-display row">
                    <div className="column-1 flex-display">
                        <label className="form-label">DOB</label>
                        <div>
                            <input
                                max={maxDate}
                                onChange={onDOBChange}
                                type="date"
                                className={`form-control ${
                                    errors.dob ? "error-field" : null
                                }`}
                                name="dob"
                            />
                            {errors.dob && (
                                <p className="error-msg">{errors.dob}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex-display ml-30">
                        <label className="form-label">Age</label>
                        <div>
                            <div>
                                <input
                                    value={age}
                                    readOnly
                                    className="form-control age-input"
                                    name="age"
                                    type="number"
                                />
                                <select
                                    className="ml-10"
                                    value={ageRepresentation}
                                    onChange={ageRepresentChange}
                                >
                                    <option value="years">Years</option>
                                    <option value="months">Months</option>
                                </select>
                            </div>
                            {errors.age && (
                                <p className="error-msg">{errors.age}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-display row">
                    <div className="flex-display column-1">
                        <label className="form-label">Appointment Date</label>
                        <div>
                            <input
                                min={maxDate}
                                onChange={handleChange}
                                type="date"
                                className="form-control"
                                name="appointmentDate"
                            />
                            {errors.appointmentDate && (
                                <p className="error-msg">
                                    {errors.appointmentDate}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex-display ml-30">
                        <label className="form-label">Phone No</label>
                        <div>
                            <input
                                onChange={handleChange}
                                name="phoneNo"
                                className="form-control"
                                type="number"
                            />
                            {errors.phoneNo && (
                                <p className="error-msg">{errors.phoneNo}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-display row">
                    <div className="flex-display">
                        <label className="form-label">Address</label>
                    </div>
                    <div className="address-fields">
                        <input
                            name="addressLine1"
                            onChange={handleChange}
                            placeholder="Address line 1"
                            className="form-control w-100"
                            type="text"
                        />
                        {errors.addressLine1 && (
                            <p className="error-msg">{errors.addressLine1}</p>
                        )}
                        <input
                            name="addressLine2"
                            onChange={handleChange}
                            placeholder="Address line 2"
                            className="form-control w-100 mt-20"
                            type="text"
                        />
                        {errors.addressLine2 && (
                            <p className="error-msg">{errors.addressLine2}</p>
                        )}
                        <div className="flex-display space-between mt-20">
                            <div className="fixed-sm">
                                <input
                                    name="city"
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="form-control w-100"
                                    type="text"
                                />
                                {errors.city && (
                                    <p className="error-msg">{errors.city}</p>
                                )}
                            </div>
                            <div className="fixed-sm">
                                <input
                                    name="state"
                                    onChange={handleChange}
                                    placeholder="State"
                                    className="form-control w-100"
                                    type="text"
                                />
                                {errors.state && (
                                    <p className="error-msg ml-10">
                                        {errors.state}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex-display mt-20 space-between">
                            <div className="fixed-sm">
                                <input
                                    placeholder="Pincode/Zipcode"
                                    name="pincode"
                                    onChange={handleChange}
                                    className="form-control w-100"
                                    type="number"
                                />
                                {errors.pincode && (
                                    <p className="error-msg">
                                        {errors.pincode}
                                    </p>
                                )}
                            </div>
                            <div className="fixed-sm">
                                <select
                                    name="country"
                                    defaultValue="select"
                                    className="w-100"
                                    placeholder="please select a country"
                                    onChange={handleChange}
                                >
                                    <option disabled value="select">
                                        Please select a country
                                    </option>
                                    <option value="india">India</option>
                                    <option value="usa">USA</option>
                                    <option value="England">England</option>
                                </select>
                                {errors.country && (
                                    <p className="error-msg ml-10">
                                        {errors.country}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <p className="title">Medical Scan Details</p>
                <hr></hr>
                <div className="flex-display">
                    <ScanList setScanItem={setScanItem} />
                </div>
                <Table
                    columns={[
                        "Scan Name",
                        "Scan Amount",
                        "Discount",
                        "Total Amount",
                        ""
                    ]}
                    component="scan"
                    rows={selectedScans}
                    deleteRow={deleteAddedScan}
                />
                <button
                    type="submit"
                    className={`secondary-btn mt-10 save-btn ${
                        selectedScans.length > 0 ? "" : "disable-btn"
                    }`}
                >
                    Save
                </button>
            </form>
        </div>
    );
}

//Component to add scan items and props in UI
const ScanList = ({ setScanItem }) => {
    const [searchText, setSearchText] = useState("");
    const [displayScanList, setDisplayScanList] = useState([]);
    const [selectedScanItem, setSelectedScanItem] = useState(null);
    const [discount, setDiscount] = useState(null);

    const onScanSearchChange = (event) => {
        const searchText = event.target.value.toLowerCase();
        const list = scanList.filter((x) =>
            x.name.toLocaleLowerCase().includes(searchText)
        );
        setDisplayScanList(list);
        setSearchText(searchText);
    };

    const scanItemClicked = (value) => {
        const option = scanList.find((x) => x.value === value);
        setSelectedScanItem(option);
        setDisplayScanList([]);
        setSearchText(option.name);
    };

    const addClickHandler = (event) => {
        if (discount < 0) {
            alert("Invalid Discount amount");
            return;
        }
        if (selectedScanItem?.maxDiscount < discount) {
            alert(
                `Max discount can be availed is ${selectedScanItem.maxDiscount}`
            );
            return;
        }
        const scanItem = { ...selectedScanItem };
        scanItem.discount = discount === null ? 0 : discount;
        scanItem.totalAmount = scanItem.scanAmount - discount;
        setSelectedScanItem(null);
        setScanItem(scanItem);
        document.getElementById("discount").value = "";
        document.getElementById("scanAmount").value = "";
        setSearchText("");
        event.preventDefault();
    };

    return (
        <div className="ml-10 flex-display">
            <label className="mt-10">Scan List</label>
            <div className="scan-list">
                <input
                    className="ml-10 form-control"
                    type="text"
                    value={searchText}
                    onChange={onScanSearchChange}
                />
                {displayScanList.length > 0 && (
                    <div className="scan-options">
                        {displayScanList.map((option) => (
                            <p
                                key={option.value}
                                className="scan-option"
                                onClick={() => scanItemClicked(option.value)}
                            >
                                {option.name}
                            </p>
                        ))}
                    </div>
                )}
            </div>
            <label className="ml-10 mt-10">Scan Amount</label>
            <label className="ml-10  mt-10  scan-amount" id="scanAmount">
                {selectedScanItem?.scanAmount ?? null}
            </label>
            <label className="ml-10 mt-10">Discount</label>
            <input
                className="ml-10 form-control"
                min="0"
                type="number"
                id="discount"
                onChange={(event) => {
                    setDiscount(event.target.value);
                }}
            />
            <button
                onClick={addClickHandler}
                className={`secondary-btn ${
                    selectedScanItem ? "" : "disable-btn"
                }`}
            >
                Add
            </button>
        </div>
    );
};

export default AppointmentForm;
