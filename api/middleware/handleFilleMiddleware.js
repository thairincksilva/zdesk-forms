import busboy from 'busboy';

export function fileUploadMiddleware(request, response, next) {
    const busboyHandle = busboy({
        headers: request.headers
      })
    
      busboyHandle.on('field', (name, value) => {
        request.body[name] = value
      })
    
      busboyHandle.on(
        'file',
        (inputName, stream, info) => {
          stream.on('data', (buffer) => {
            if (request.files === undefined) {
              request.files = {}
            }
    
            request.files[inputName] = {
              ...info,
              stream,
              inputName,
              buffer
            }
          })
    
          stream.on('error', () => {
            throw new ValidationException(
              __('messages.validation.maxFileLength', {
                length: '4 Megabytes'
              })
            )
          })
        }
      )
    
      busboyHandle.on('finish', () => {
        next()
      })
}

export default fileUploadMiddleware;