import axios from "axios";
import {useAuth} from "@/hooks/utils/useAuth.js";
// import { useLocale } from 'use-intl';


const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

const refreshToken = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {session, setSession} = useAuth()

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.refresh}`,
      'Content-Type': 'application/json'
    }
  });

  const res = await response.json();

  if (res.code && res.code !== 200) {
    localStorage.removeItem("auth-session")
    window.location.href = `/auth/login?callbackUrl=${window.location.pathname}`
    return
  }

  setSession(res.data)

  return res.data
}

let isRefreshing = false;
let refreshAndRetryQueue = []

instance.interceptors.request.use(
  async (config) => {
    const { session } = useAuth();
    // const { locale } = useLocale();

    if (session) {
      // let language = 'uz_Latn'; // Default language
      // switch (locale) {
      //   case 'ru':
      //     language = 'ru';
      //     break;
      //   case 'uz':
      //     language = 'uz_Latn';
      //     break;
      //   case 'cryl':
      //     language = 'uz_Kyrl';
      //     break;
      //   default:
      //     language = 'uz_Latn'; // Fallback
      // }

      config.headers.Authorization = `Bearer ${session?.access}`;
      // config.headers['Accept-Language'] = language;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const {session} = useAuth()

    if (error.response && error.response.status === 401 && session && session.user) {
      if (!isRefreshing) {
        isRefreshing = true

        try {
          const data = refreshToken()
          console.log("refresh token req:", data)
          originalRequest.headers.Authorization = `Bearer ${data.access}`;

          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            instance.request(config)
              .then(response => resolve(response))
              .catch(err => reject(err))
          })

          refreshAndRetryQueue.length = 0

          return axios(originalRequest);
        } catch (e) {
          console.log(e)
        }finally {
          isRefreshing = false
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance