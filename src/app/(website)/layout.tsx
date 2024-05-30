import { AuthProvider } from "../../context/authContext";

export default function Layout({children}) {
  console.log('layout rendered???');
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}