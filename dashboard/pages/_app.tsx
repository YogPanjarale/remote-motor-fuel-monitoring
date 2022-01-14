import { QueryClient, QueryClientProvider } from 'react-query'
// import 'tailwindcss/tailwind.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp
