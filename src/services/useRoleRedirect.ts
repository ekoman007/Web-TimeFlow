import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useRoleRedirect = (requiredRole: string) => {
  const router = useRouter();
  const role = localStorage.getItem("roleName");

  useEffect(() => {
    if (role !== requiredRole) {
      router.push("/unauthorized"); // Ridrejto përdoruesin që nuk ka akses
    }
  }, [role, requiredRole, router]);
};

export default useRoleRedirect;
