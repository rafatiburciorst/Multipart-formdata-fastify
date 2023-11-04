import axios from 'axios'
const form = document.getElementById('form') as HTMLFormElement


const api = axios.create({
    baseURL: 'http://localhost:3000'
})

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)


form.onsubmit = async (e) => {
    e.preventDefault()

    const file = document.getElementById('file') as HTMLInputElement
    const formData = new FormData(form)
    const msgName = document.getElementById('message-name')! as HTMLSpanElement
    const msgDesc = document.getElementById('message-description')! as HTMLSpanElement
    const success = document.getElementById('success')! as HTMLSpanElement

    msgName.innerText = ''
    msgDesc.innerText = ''
    success.innerText = ''

    const fieldName = formData.get('name')
    const fieldDescription = formData.get('description')

    if (!fieldName) {
        alert('Name field is required')
        return
    }

    if (!fieldDescription) {
        alert('Name field is required')
        return
    }

    if (file.files?.length === 0) {
        formData.delete('file')
    }

    try {
        const res = await api.post('/form', formData)
        form.reset()
        console.log(res.data);
        success.innerText = `${res.data.message}`
        setTimeout(() => {
            success.innerText = ''
        }, 2000)
    } catch (error: any) {
        const err: ObjError = error.response.data
        console.log(err.message);
        msgName.innerText = err.message.name ? `${err.message.name}` : ''
        msgDesc.innerText = err.message.description ? `${err.message.description}` : ''
    }
}


interface ObjError {
    message: {
        name?: string[]
        description?: string[]
    }
}