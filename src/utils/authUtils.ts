import Swal from "sweetalert2";

import { supabase } from "@/lib/supabase";
const supabaseUrlKey = import.meta.env.VITE_SUPABASE_URL;

export const getUserById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("User")
      .select()
      .eq("supabaseId", id);

    if (error) throw error;

    return data;
  } catch (error: any) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

export const validateInput = (email: string, password: string): boolean => {
  if (!email || !password) {
    Swal.fire({
      title: "Error!",
      text: "Email or Password is Empty",
      icon: "error",
      confirmButtonText: "Back",
    });
    return false;
  }
  return true;
};

export const handleLogin = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data.user) {
      localStorage.setItem("id", data.user.id);
    }
    if (error) throw error;
    Swal.fire({
      title: "Success!",
      text: "Login Successful",
      icon: "success",
      confirmButtonText: "Ok",
    }).then(() => {
      window.location.href = "/dashboard";
    });
  } catch (error: any) {
    console.log(error);
    let message = "";
    if (error.message === "Email not confirmed") {
      message = "Email not Confirmed, Please Check Your Email";
    } else if (error.message === "Invalid login credentials") {
      message = "Wrong Email or Password";
    }
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonText: "Back",
    });
  }
};

export const validateRegisterInput = (
  name: string,
  email: string,
  password: string,
  role: string
): boolean => {
  if (!name || !email || !password || !role) {
    Swal.fire({
      title: "Error!",
      text: "All fields are required",
      icon: "error",
      confirmButtonText: "Back",
    });
    return false;
  }
  return true;
};

export const validateResetPasswordInput = (
  password: string,
  confirmPassword: string
): boolean => {
  if (!password || !confirmPassword) {
    Swal.fire({
      title: "Error!",
      text: "All fields are required",
      icon: "error",
      confirmButtonText: "Back",
    });
    return false;
  }
  if (password !== confirmPassword) {
    Swal.fire({
      title: "Error!",
      text: "Password and Confirm Password do not match",
      icon: "error",
      confirmButtonText: "Back",
    });
    return false;
  }
  return true;
};

export const handleRegister = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<void> => {
  try {
    const userExist = await supabase
      .from("User")
      .select()
      .eq("email", email.toLocaleLowerCase());
    if (userExist.data && userExist.data.length > 0) {
      Swal.fire({
        title: "Error!",
        text: "User Already Exists",
        icon: "error",
        confirmButtonText: "Back",
      });
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    const { error: insertError } = await supabase.from("User").insert({
      name,
      email: email.toLocaleLowerCase(),
      role: "user",
      supabaseId: data?.user?.id,
    });
    if (insertError) throw insertError;
    Swal.fire({
      title: "Success!",
      text: "Registration Successful, Please Check Your Spam Email to Confirm",
      icon: "success",
      confirmButtonText: "Ok",
    }).then(() => {
      window.location.href = "/login";
    });
  } catch (error: unknown) {
    const errorMessage =
      (error as any)?.response?.data?.error ||
      "An error occurred during registration";
    Swal.fire({
      title: "Error!",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "Back",
    });
    console.log(error);
  }
};

export const handleResetPassword = async (password: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) throw error;
    Swal.fire({
      title: "Success!",
      text: "Password Reset Successful",
      icon: "success",
      confirmButtonText: "Ok",
    }).then(() => {
      localStorage.removeItem(`sb-${supabaseUrlKey}-auth-token`);
      window.location.href = "/login";
    });
  } catch (error: any) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

export const handleForgotPassword = async (email: string): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("User")
      .select()
      .eq("email", email.toLocaleLowerCase());
    if (error) throw error;
    if (data && data.length > 0) {
      const { error: forgotPasswordError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: "https://projectsync.site/reset-password",
        });
      if (forgotPasswordError) throw forgotPasswordError;
      Swal.fire({
        title: "Success!",
        text: "Password Reset Email Sent",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        window.location.href = "/login";
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "User does not exist",
        icon: "error",
        confirmButtonText: "Back",
      });
    }
  } catch (error) {}
};
