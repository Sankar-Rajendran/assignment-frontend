import React, { useState, useEffect } from "react";
import useForm from "../custom-hooks/useForm";
import { API_ENDPOINT } from "../config";
import { paymentFormValidation } from "../forms/formValidations";
import Table from "./Table";

const BillingComponent = ({ billingId, toggleBillingView }) => {
    const [billingDetails, setBillingDetails] = useState(null);
    const [billTransactions, setBillTransactions] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Card");

    useEffect(() => {
        fetchBillingDetails();
    }, []);

    const fetchBillingDetails = async () => {
        try {
            const response = await fetch(
                `${API_ENDPOINT}billingdetails?billingId=${billingId}`
            );
            const billingDetails = await response.json();
            setBillingDetails(billingDetails);
            setBillTransactions(billingDetails.transactions);
        } catch (error) {
            alert("Something went wrong");
        }
    };

    const saveTransaction = async () => {
        try {
            if (
                billingDetails.transactions.length === 2 &&
                values.paymentAmount < billingDetails.balanceAmount
            ) {
                alert(
                    "Kindly make full payment as two transactions are already over"
                );
                return;
            } else if (
                values.paymentAmount <
                (billingDetails.totalAmount / 100) * 20
            ) {
                alert("You should pay at least 20% of the total amount");
            } else {
                const transaction = {
                    billingID: billingId,
                    paymentDate: new Date().toLocaleDateString(),
                    paymentAmount: values.paymentAmount,
                    paymentMethod: paymentMethod
                };
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transaction: transaction })
                };
                const response = await fetch(
                    `${API_ENDPOINT}transaction`,
                    requestOptions
                );
                fetchBillingDetails();
                toggleBillingView(false);
                alert("Transaction successfully");
            }
        } catch (error) {
            alert("Something went wrong");
        }
    };

    const {
        values,
        errors,
        setFieldValues,
        handleChange,
        handleSubmit
    } = useForm(saveTransaction, paymentFormValidation);

    const toggleView = () => {
        toggleBillingView(false);
    };

    const paymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
        setFieldValues(event.target.name, event.target.value);
    };

    return (
        <div className="billing-component">
            <div className="billing-container">
                <div className="flex-display space-between">
                    <p className="title">Patient Billing</p>
                    <p onClick={toggleView} className="title pointer">
                        Back to Appointments
                    </p>
                </div>
                <hr></hr>
                {billingDetails && (
                    <div className="flex-display space-between">
                        <div className="flex-1">
                            <p>Current Billing Status</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Patient Name</td>
                                        <td>{billingDetails.patientName}</td>
                                    </tr>
                                    <tr>
                                        <td>PatientID</td>
                                        <td>{billingDetails.patientID}</td>
                                    </tr>
                                    <tr>
                                        <td>Age/Gender</td>
                                        <td>{`${billingDetails.gender}/${billingDetails.age}`}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Amount</td>
                                        <td>{`${billingDetails.totalAmount} INR`}</td>
                                    </tr>
                                    <tr>
                                        <td>Discount</td>
                                        <td>{`${billingDetails.discount} INR`}</td>
                                    </tr>
                                    <tr>
                                        <td>Paid Amount</td>
                                        <td>{`${billingDetails.amountPaid} INR`}</td>
                                    </tr>
                                    <tr>
                                        <td>Status</td>
                                        <td>{`${billingDetails.status}`}</td>
                                    </tr>
                                    <tr>
                                        <td>Balance</td>
                                        <td>{`${billingDetails.balanceAmount} INR`}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {billingDetails.status === "fullyPaid" ? (
                                <p className="mt-10">You don't have any due</p>
                            ) : (
                                <div className="billing-info">
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex-display mt-20 w-100">
                                            <label>Payable Amount: </label>
                                            <div>
                                                <input
                                                    onChange={handleChange}
                                                    name="paymentAmount"
                                                    type="number"
                                                />
                                                {errors.paymentAmount && (
                                                    <p className="error-msg">
                                                        {errors.paymentAmount}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-display mt-20">
                                            <label>Payment Mode : </label>
                                            <div>
                                                <select
                                                    name="paymentMethod"
                                                    onChange={
                                                        paymentMethodChange
                                                    }
                                                    className="ml-10"
                                                >
                                                    <option value="select">
                                                        Please Select
                                                    </option>
                                                    <option value="CARD">
                                                        Card
                                                    </option>
                                                    <option value="CASH">
                                                        Cash
                                                    </option>
                                                </select>
                                                {errors.paymentMethod && (
                                                    <p className="error-msg">
                                                        {errors.paymentMethod}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <input
                                            onChange={handleChange}
                                            placeholder="Card Holder's Name"
                                            name="cardHolderName"
                                            className="w-100 mt-20"
                                            type="text"
                                        />
                                        {errors.cardHolderName && (
                                            <p className="error-msg">
                                                {errors.cardHolderName}
                                            </p>
                                        )}
                                        <input
                                            onChange={handleChange}
                                            placeholder="Card Number"
                                            name="cardNumber"
                                            className="w-100 mt-20"
                                            type="number"
                                        />
                                        {errors.cardNumber && (
                                            <p className="error-msg">
                                                {errors.cardNumber}
                                            </p>
                                        )}
                                        <div className="mt-20">
                                            <label>Expiry</label>
                                            <div className="flex-display">
                                                <div>
                                                    <input
                                                        name="expiryDate"
                                                        onChange={handleChange}
                                                        className="expiry-date"
                                                        type="date"
                                                    />
                                                    {errors.expiryDate && (
                                                        <p className="error-msg">
                                                            {errors.expiryDate}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <input
                                                        onChange={handleChange}
                                                        name="cvvNo"
                                                        className="cvv-no"
                                                        type="number"
                                                    />
                                                    {errors.cvvNo && (
                                                        <p className="error-msg">
                                                            {errors.cvvNo}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="ml-20">
                                                    <b>128 bit secured</b>
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="secondary-btn mt-20"
                                        >
                                            SAVE
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                        <div className="ml-20 flex-1">
                            <p>Previous Transactions:</p>
                            <Table
                                columns={[
                                    "Date",
                                    "Paid Amount",
                                    "Payment Mode"
                                ]}
                                component="transactions"
                                rows={billTransactions}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingComponent;
