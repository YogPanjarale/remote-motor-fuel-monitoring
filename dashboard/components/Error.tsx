//tailwind
import 'tailwindcss/tailwind.css'
const ErrorPage = ({ statusCode,message }) => {
    return (
        <div className="h-screen flex flex-col justify-center items-center text-center">
                <div className="inline-flex items-center">
                    <h1 className="text-2xl py-[11px] pr-6 mr-5 inline-block border-gray-400 border-r-[1px]  font-semibold">{statusCode}</h1>
                    <h2 className="text-sm">{message}</h2>
                </div>
        </div>
    );
    };
export default ErrorPage;