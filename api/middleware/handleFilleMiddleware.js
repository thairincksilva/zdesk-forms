import busboy from 'busboy';

export function fileUploadMiddleware(request, response, next) {
    const busboyHandle = busboy({
        headers: request.headers
    });

    busboyHandle.on('field', (name, value) => {
        request.body[name] = value;
        console.log(`Campo: ${name}, Valor: ${value}`);
    });

    busboyHandle.on('file', (inputName, stream, info) => {
        stream.on('data', (buffer) => {
            if (request.files === undefined) {
                request.files = {};
            }

            request.files[inputName] = {
                ...info,
                stream,
                inputName,
                buffer
            };
        });

        stream.on('error', () => {
            console.error('Erro ao processar o arquivo.');
            response.status(400).json({ message: 'Erro ao processar o arquivo.' });
        });
    });

    busboyHandle.on('finish', () => {
        next();
    });

    // Remover a chamada a end aqui.
    request.pipe(busboyHandle); // Certifique-se de passar a requisição para o busboy
}

export default fileUploadMiddleware;
