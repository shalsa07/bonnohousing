'use client'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext';
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5';
// --- INTERNAL SVG ICONS (Stable & Dependency Free) ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
);
const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-8-2h4v2h-4V4z" /></svg>
);
const MoneyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M5 8h2v8H5zm7 0H9c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 6h-1v-4h1v4zm7-6h-3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h3c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 6h-1v-4h1v4z" /><path fill="none" d="M0 0h24v24H0z" /><path d="M2 4v16h20V4H2zm18 14H4V6h16v12z" /></svg>
);
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
);
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-green-600"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
);
const PaperPlaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
);

import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience';

export default function LoadApplicationForm() {
    const { experienceState, experienceDispatch } = useExperienceContext()
    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = useState({
        // Personal
        firstName: '',
        lastName: '',
        idNumber: '', // Omang or Passport
        nationality: 'Botswana',
        dob: '',
        phone: '',
        email: '',
        maritalStatus: 'Single',

        // Spousal (Conditional)
        spouseName: '',
        spouseId: '',
        spouseIncome: '',

        // Employment
        employmentStatus: 'Employed',
        employerName: '',
        jobTitle: '',
        employmentDuration: '',

        // Financials (Monthly)
        grossIncome: '',
        netIncome: '', // Take home pay
        otherIncome: '',
        existingLoans: '', // Total monthly repayment for personal/car loans
        rentExpense: '',
        livingExpenses: '',

        // Property Interest
        projectInterest: 'Bonno Housing Scheme',
        unitType: 'Type A (Low Cost)',
        depositAvailable: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'bonno',
                    formData
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Bonno Scheme Application Submitted:', formData);
                setSubmitted(true);
            } else {
                throw new Error(data.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setError('Failed to submit application. Please try again or contact us directly.');
        } finally {
            setLoading(false);
        }
    };

    // --- SUB-COMPONENTS FOR STYLING ---
    const SectionHeader = ({ icon, title }) => (
        <div className="flex items-center gap-3 mb-6 border-b border-neutral-200 pb-2 mt-8">
            <span className="text-black">{icon}</span>
            <h3 className="text-lg font-bold uppercase tracking-widest text-neutral-800">{title}</h3>
        </div>
    );

    const InputField = ({ label, name, type = 'text', placeholder, required = true }) => (
        <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                className="w-full p-3 border border-neutral-300 bg-neutral-50 focus:bg-white focus:border-black outline-none transition-colors text-sm rounded-sm"
            />
        </div>
    );

    const SelectField = ({ label, name, options, required = true }) => (
        <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full p-3 border border-neutral-300 bg-neutral-50 focus:bg-white focus:border-black outline-none transition-colors text-sm appearance-none rounded-sm"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );

    // --- RENDER SUCCESS STATE ---
    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto p-12 bg-neutral-50 text-center border-t-4 border-black shadow-lg my-10 rounded-sm">
                <div className="flex justify-center mb-6">
                    <CheckCircleIcon />
                </div>
                <h2 className="text-3xl font-bold uppercase mb-4 text-neutral-800">Application Received</h2>
                <p className="text-neutral-600 mb-8 leading-relaxed">
                    Thank you, {formData.firstName}. We have received your pre-qualification details for the <strong>Bonno Housing Scheme</strong>.
                    Our financial advisors will assess your affordability profile against the scheme's criteria and contact you within 48 hours.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors rounded-sm"
                >
                    Submit Another Application
                </button>
            </div>
        );
    }

    // --- RENDER APPLICATION FORM ---
    return (
        (experienceState?.loanForm && <div className='flex items-start justify-center absolute top-0 left-0 w-full h-full bg-black/75 z-40 overflow-y-auto'>
            <div className="loan-form max-w-4xl mx-auto my-12 absolute h-fit w-5/6 md:w-[95vw] z-20 bg-white shadow-2xl font-sans rounded-sm">
                <div className='relative flex flex-col w-full h-full'>
                    {/* Close Controls */}
                    <div className='flex z-10 absolute -right-3 -top-3 gap-2'>
                        {/* Close Button */}
                        <div
                            onClick={() => experienceDispatch({ type: ACTIONS_EXPERIENCE.TOGGLE_LOAN_FORM, payload: false })}
                            className='flex cursor-pointer justify-center border-2 border-gray-400 bg-black/40 text-white items-center w-10 h-10 rounded-full shadow'
                        >
                            <IoClose className='text-3xl' />
                        </div>
                    </div>
                    {/* Header */}
                    <div className="bg-black text-white p-10 text-center">
                        <h1 className="text-3xl font-black uppercase tracking-[0.2em] mb-2">Bonno Housing Scheme</h1>
                        <p className="text-neutral-400 font-serif italic text-sm">
                            Loan Pre-Qualification Assessment Form
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12">

                        {/* --- SECTION 1: PERSONAL DETAILS --- */}
                        <SectionHeader icon={<UserIcon />} title="Personal Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="First Name" name="firstName" placeholder="e.g. Thabo" />
                            <InputField label="Last Name" name="lastName" placeholder="e.g. Molefe" />
                            <InputField label="ID / Passport Number" name="idNumber" placeholder="Omang No." />
                            <InputField label="Date of Birth" name="dob" type="date" />
                            <InputField label="Phone Number" name="phone" type="tel" placeholder="+267 71 234 567" />
                            <InputField label="Email Address" name="email" type="email" placeholder="name@example.com" />
                            <SelectField
                                label="Nationality"
                                name="nationality"
                                options={['Botswana', 'Zambia', 'Other (Resident)', 'Other (Non-Resident)']}
                            />
                            <SelectField
                                label="Marital Status"
                                name="maritalStatus"
                                options={['Single', 'Married (Community of Property)', 'Married (Out of Community)', 'Divorced', 'Widowed']}
                            />
                        </div>

                        {/* Conditional Spousal Fields */}
                        {formData.maritalStatus.includes('Married') && (
                            <div className="mt-8 bg-neutral-50 p-6 border-l-4 border-black">
                                <h4 className="text-sm font-bold uppercase mb-4 text-neutral-800 flex items-center gap-2">
                                    <UserIcon /> Spouse Details (For Joint Application)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Spouse Full Name" name="spouseName" required={false} />
                                    <InputField label="Spouse ID Number" name="spouseId" placeholder="Omang No." required={false} />
                                    <div className="md:col-span-2">
                                        <InputField label="Spouse Net Monthly Income" name="spouseIncome" type="number" placeholder="0.00" required={false} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- SECTION 2: EMPLOYMENT --- */}
                        <SectionHeader icon={<BriefcaseIcon />} title="Employment Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectField
                                label="Employment Status"
                                name="employmentStatus"
                                options={['Employed (Permanent)', 'Employed (Contract)', 'Self-Employed', 'Business Owner', 'Retired', 'Unemployed']}
                            />
                            <InputField label="Current Employer / Business Name" name="employerName" />
                            <InputField label="Job Title" name="jobTitle" />
                            <SelectField
                                label="Duration at Current Job"
                                name="employmentDuration"
                                options={['Less than 1 year', '1 - 3 Years', '3 - 5 Years', 'More than 5 Years']}
                            />
                        </div>

                        {/* --- SECTION 3: FINANCIAL HEALTH --- */}
                        <SectionHeader icon={<MoneyIcon />} title="Financial Profile (Monthly)" />
                        <div className="bg-blue-50 border border-blue-100 p-4 mb-6 text-xs text-blue-800 rounded-sm">
                            <strong>Note:</strong> Please provide accurate monthly figures to allow for a realistic loan affordability calculation (Debt Service Ratio).
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="col-span-1">
                                <InputField label="Gross Income (Before Tax)" name="grossIncome" type="number" placeholder="BWP" />
                            </div>
                            <div className="col-span-1">
                                <InputField label="Net Income (Take Home)" name="netIncome" type="number" placeholder="BWP (After deductions)" />
                            </div>
                            <div className="col-span-1">
                                <InputField label="Other Income (Rentals/Side Biz)" name="otherIncome" type="number" placeholder="BWP (Optional)" required={false} />
                            </div>
                        </div>

                        <div className="bg-neutral-50 p-6 rounded-sm border border-neutral-100">
                            <h4 className="text-xs font-bold uppercase mb-4 text-neutral-500 border-b border-neutral-200 pb-2">Monthly Deductions & Expenses</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Total Loan Repayments" name="existingLoans" type="number" placeholder="Personal loans, car finance, furniture, etc." required={false} />
                                <InputField label="Current Rent" name="rentExpense" type="number" required={false} />
                                <InputField label="Estimated Living Expenses" name="livingExpenses" type="number" placeholder="Groceries, transport, school fees, utilities" />
                            </div>
                        </div>

                        {/* --- SECTION 4: PROPERTY PREFERENCE --- */}
                        <SectionHeader icon={<HomeIcon />} title="Bonno Unit Selection" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* <div className="col-span-1 md:col-span-2">
                                    <SelectField
                                        label="Development Selection"
                                        name="projectInterest"
                                        options={[
                                            'Bonno Housing Scheme (Botswana)',
                                            'The Signature Collection (Zambia)',
                                            'SEZA Industrial/Commercial Space'
                                        ]}
                                    />
                                </div> */}

                            {formData.projectInterest === 'Bonno Housing Scheme (Botswana)' && (
                                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 border border-gray-200 rounded-sm">
                                    <SelectField
                                        label="Preferred Unit Typology"
                                        name="unitType"
                                        options={[
                                            'Type A (Low Cost - 2 Bedroom)',
                                            'Type B (Medium Cost - 2 Bedroom)',
                                            'Type C (Medium Cost - 3 Bedroom)',
                                            'Type D (High Cost - 3 Bedroom)'
                                        ]}
                                    />
                                    <InputField label="Cash Deposit Available" name="depositAvailable" type="number" placeholder="Amount available for down payment (BWP)" />
                                </div>
                            )}

                            {/* Fallback for other project selections if changed */}
                            {formData.projectInterest !== 'Bonno Housing Scheme (Botswana)' && (
                                <div className="col-span-1 md:col-span-2">
                                    <InputField label="Cash Deposit Available" name="depositAvailable" type="number" placeholder="Amount available for down payment" />
                                </div>
                            )}

                        </div>

                        {/* --- SUBMIT --- */}
                        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col items-center">
                            <div className="flex items-start gap-3 mb-6 max-w-lg text-neutral-500">
                                <input type="checkbox" required className="mt-1" />
                                <p className="text-xs">
                                    I hereby declare that the information provided is true and correct. I authorize PPSBluyari and its financial partners to conduct necessary credit checks for the purpose of this application.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-sm text-sm max-w-lg w-full">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative inline-flex items-center justify-center gap-3 bg-black text-white px-12 py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all w-full md:w-auto shadow-lg hover:shadow-xl rounded-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Assessment'}
                                {!loading && <PaperPlaneIcon />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>)
    )
}
