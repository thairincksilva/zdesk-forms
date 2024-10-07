import busboy from 'busboy';

export function fileUploadMiddleware(request, response, next) {
    const busboyHandle = busboy({
        headers: request.headers,
    });

    request.body = {}; 
    request.files = {};

    busboyHandle.on('field', (name, value) => {
        request.body[name] = value;
    });

    busboyHandle.on('file', (inputName, stream, info) => {
        request.files[inputName] = {
            ...info,
            stream,
            inputName,
        };

        stream.on('error', (err) => {
            next(new Error('File stream error: ' + err.message));
        });
    });

    busboyHandle.on('finish', () => {
        next(); 
    });

    busboyHandle.end(request.rawBody);
}

export default fileUploadMiddleware;