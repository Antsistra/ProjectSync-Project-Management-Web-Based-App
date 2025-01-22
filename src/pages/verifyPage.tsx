import React, { useEffect } from "react";

export default function VerifyPage() {
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <div>
      <h1>Verifikasi Sukses</h1>
      <a href="/login">
        <button>Back To menu</button>
      </a>
    </div>
  );
}
