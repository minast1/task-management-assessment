
import './App.css'
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import TasksPage from './TasksPage';
import { Toaster } from 'sonner';



const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <TasksPage />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App
