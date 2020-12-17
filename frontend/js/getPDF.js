export function pdfFileToDataUrl(file) {
    if (file.type !== 'application/pdf') {
        throw Error('Provided file is not a pdf.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}