const scanList = [
    {
        name: "CT BRAIN",
        value: "CT",
        maxDiscount: 100,
        scanAmount: 500,
        slots: 7
    },
    {
        name: "MRI BRAIN",
        value: "MRI",
        maxDiscount: 300,
        scanAmount: 800,
        slots: 6
    },
    {
        name: "GLUCOSE FASTING",
        value: "LAB",
        maxDiscount: 10,
        scanAmount: 100,
        slots: "na"
    }
];

const billingStatus = {
    notBilled: "notBilled",
    dueBilled: "dueBilled",
    fullyBilled: "fullyBilled"
};

const userAge = { months: "months", years: "years" };

const genderConst = [
    { name: "Male", value: "male", salutationValue: "mr" },
    { name: "Female", value: "female", salutationValue: "ms,mrs" }
];

export { scanList, billingStatus, userAge, genderConst };
