'use client';

import { useState, useRef, useEffect } from 'react';

export default function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Enter text...',
    disabled = false,
    label = ''
}) {
    const editorRef = useRef(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');

    // Initialize editor content
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    // Handle content changes
    const handleInput = () => {
        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML);
        }
    };

    // Execute formatting command
    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    // Handle font size change
    const setFontSize = (size) => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontSize = size;

            try {
                range.surroundContents(span);
            } catch (e) {
                // If surroundContents fails, use execCommand as fallback
                execCommand('fontSize', '7');
                const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
                fontElements?.forEach(el => {
                    el.removeAttribute('size');
                    el.style.fontSize = size;
                });
            }

            handleInput();
        }
        setShowFontSizeMenu(false);
    };

    // Handle color change
    const handleColorChange = (color) => {
        setCurrentColor(color);
        execCommand('foreColor', color);
        handleInput();
    };

    // Create email link
    const createEmailLink = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (!selectedText) {
            alert('Please select text first');
            return;
        }

        const email = prompt('Enter email address:');
        if (email) {
            execCommand('createLink', `mailto:${email}`);
            handleInput();
        }
    };

    // Create URL link
    const createUrlLink = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (!selectedText) {
            alert('Please select text first');
            return;
        }

        const url = prompt('Enter URL:');
        if (url) {
            const fullUrl = url.startsWith('http') ? url : `https://${url}`;
            execCommand('createLink', fullUrl);
            handleInput();
        }
    };

    const fontSizes = [
        { label: 'Title', value: '32px' },
        { label: 'Heading', value: '24px' },
        { label: 'Subheading', value: '18px' },
        { label: 'Body', value: '16px' },
        { label: 'Monostyled', value: '14px' }
    ];

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div className={`border rounded-lg overflow-hidden ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Toolbar */}
                <div className="bg-gray-800 text-white p-2 flex items-center gap-1 flex-wrap">
                    {/* Text Formatting */}
                    <button
                        type="button"
                        onClick={() => execCommand('bold')}
                        className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors"
                        title="Bold"
                    >
                        <span className="font-bold text-lg">B</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('italic')}
                        className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors"
                        title="Italic"
                    >
                        <span className="italic text-lg">I</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('underline')}
                        className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors"
                        title="Underline"
                    >
                        <span className="underline text-lg">U</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('strikeThrough')}
                        className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors"
                        title="Strikethrough"
                    >
                        <span className="line-through text-lg">S</span>
                    </button>

                    <div className="w-px h-6 bg-gray-600 mx-1"></div>

                    {/* Font Size Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                            className="px-3 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors text-sm"
                            title="Font Size"
                        >
                            Aa ▼
                        </button>

                        {showFontSizeMenu && (
                            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[140px]">
                                {fontSizes.map((size) => (
                                    <button
                                        key={size.label}
                                        type="button"
                                        onClick={() => setFontSize(size.value)}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors text-sm"
                                        style={{ fontSize: size.value }}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Color Picker */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors"
                            title="Text Color"
                        >
                            <div className="w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: currentColor }}></div>
                        </button>

                        {showColorPicker && (
                            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 p-3">
                                <input
                                    type="color"
                                    value={currentColor}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="w-32 h-10 cursor-pointer"
                                />
                                <div className="mt-2 grid grid-cols-5 gap-1">
                                    {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
                                        '#FF00FF', '#00FFFF', '#FFFFFF', '#808080', '#FFA500'].map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => handleColorChange(color)}
                                                className="w-6 h-6 rounded border border-gray-600 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-gray-600 mx-1"></div>

                    {/* Link Tools */}
                    <button
                        type="button"
                        onClick={createEmailLink}
                        className="px-3 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors text-sm"
                        title="Email Link"
                    >
                        📧
                    </button>

                    <button
                        type="button"
                        onClick={createUrlLink}
                        className="px-3 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors text-sm"
                        title="URL Link"
                    >
                        🔗
                    </button>

                    <div className="w-px h-6 bg-gray-600 mx-1"></div>

                    {/* Lists */}
                    <button
                        type="button"
                        onClick={() => { execCommand('insertUnorderedList'); handleInput(); }}
                        className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors"
                        title="Bulleted List"
                    >
                        •
                    </button>

                    <button
                        type="button"
                        onClick={() => { execCommand('insertOrderedList'); handleInput(); }}
                        className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors"
                        title="Numbered List"
                    >
                        1.
                    </button>

                    <div className="w-px h-6 bg-gray-600 mx-1"></div>

                    {/* Block Quote */}
                    <button
                        type="button"
                        onClick={() => { execCommand('formatBlock', 'blockquote'); handleInput(); }}
                        className="px-3 h-9 flex items-center justify-center rounded hover:bg-gray-700 transition-colors text-sm"
                        title="Block Quote"
                    >
                        "
                    </button>
                </div>

                {/* Editor Area */}
                <div
                    ref={editorRef}
                    contentEditable={!disabled}
                    onInput={handleInput}
                    className="min-h-[150px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                    }}
                    suppressContentEditableWarning
                >
                    {!value && (
                        <span className="text-gray-400 pointer-events-none">
                            {placeholder}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
