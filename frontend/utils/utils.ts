export function withUrl(input:string){
    return `${process.env.BACKEND_URL||"http://localhost:3001"}${input}`
}