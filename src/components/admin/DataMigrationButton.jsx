'use client';

import { useState } from 'react';
import { FaDatabase, FaSpinner } from 'react-icons/fa';

export default function DataMigrationButton() {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleMigrate = async () => {
        if (!confirm('WARNING: This will migrate ALL legacy file paths in the database from "ppsbluyari" to "bonnohousing". This operation cannot be easily undone. Are you sure?')) {
            return;
        }

        setStatus('loading');
        setMessage('Migration in progress. Do not close this page...');

        try {
            const response = await fetch('/api/admin/migrate-legacy-data', {
                method: 'POST',
            });
            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data.details || data.error || 'Migration failed');
            }
        } catch (error) {
            setStatus('error');
            setMessage(error.message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FaDatabase className="text-blue-600" />
                Legacy Data Migration
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                Migrate all file URLs from the legacy <code>ppsbluyari</code> folder to <code>bonnohousing/houses</code> and update database records.
            </p>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleMigrate}
                    disabled={status === 'loading'}
                    className={`px-4 py-2 rounded-md font-medium text-white transition-colors flex items-center gap-2
                        ${status === 'loading' ? 'bg-gray-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'}
                    `}
                >
                    {status === 'loading' && <FaSpinner className="animate-spin" />}
                    {status === 'loading' ? 'Migrating...' : 'Start Full Migration'}
                </button>
            </div>

            {message && (
                <div className={`mt-4 p-3 rounded text-sm ${
                    status === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                    status === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                    'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                    {message}
                </div>
            )}
        </div>
    );
}
