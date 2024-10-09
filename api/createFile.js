export function createFile(file){
    const filePath = path.join(__dirname, file.path);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    return formData
}