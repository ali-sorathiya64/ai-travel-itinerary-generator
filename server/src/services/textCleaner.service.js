export const cleanText = (text = "") => {
    return text
        .replace(/\s+/g, " ")
        .replace(/[^a-zA-Z0-9:,.\-\/ ]/g, " ")
        .trim();
};

export const isValidText = (text = "") => {
    return text.length > 30 && /[a-zA-Z]/.test(text);
};