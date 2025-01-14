import { create } from 'zustand';
import Cookies from 'js-cookie';
import { getAllThreads } from 'features/dashboard/services/thread.service';
import { ThreadTypes } from 'types/threads.types';

interface ThreadStore {
  threads: ThreadTypes[];
  user: ThreadTypes['author'] | null;
  error: string | null; // Tambahkan state error
  fetchThreads: () => Promise<void>;
  addThread: (newThread: ThreadTypes) => void;
  updateThread: (updatedThread: ThreadTypes) => void; // Tambahkan fungsi updateThread
  deleteThread: (threadId: number) => void; // Tambahkan fungsi deleteThread
}

const useThreadStore = create<ThreadStore>((set) => ({
  threads: [],
  user: null,
  error: null,

 
  fetchThreads: async () => {
    const token = Cookies.get('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      const threadData = await getAllThreads(token);

      // Ensure threadData is an array
      if (!Array.isArray(threadData)) {
        console.error('Invalid data format:', threadData);
        set({ threads: [] }); // Reset to an empty array if data is not valid
        return;
      }

      console.log('Fetched Threads Data:', threadData); // Log fetched data
      set({
        threads: threadData,
        user: threadData.length > 0 ? threadData[0].author : null,
      });
    } catch (error) {
      console.error('Error fetching threads:', error);
      set({ threads: [] }); // Reset to an empty array in case of error
    }
  },
  
  addThread: (newThread) =>
    set((state) => ({ threads: [newThread, ...state.threads], error: null })),

  updateThread: (updatedThread) =>
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === updatedThread.id ? updatedThread : thread
      ),
    })),


  deleteThread: (threadId) =>
    set((state) => ({
      threads: state.threads.filter((thread) => thread.id !== threadId),
      error: null,
    })),
}));

export default useThreadStore;
