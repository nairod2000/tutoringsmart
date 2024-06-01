'use client';
import { AuthProvider } from "../../context/authContext";
import TopicsProvider from "../../context/topicsContext";

export default function Layout({children}) {
  console.log('layout rendered???');
  return (
    <AuthProvider>
      <TopicsProvider>
        {children}
      </TopicsProvider>
    </AuthProvider>
  )
}